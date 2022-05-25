import os
import random
from typing import OrderedDict
import torch
from torch.utils.data import Dataset, DataLoader, IterableDataset, random_split
from peewee import *
from torch import nn
import torch.nn.functional as F
import base64
import numpy as np
import pytorch_lightning as pl


db = SqliteDatabase("2021-07-31-lichess-evaluations-37MM.db")

class Evaluations(Model):
    id = IntegerField()
    fen = TextField()
    binary = BlobField()
    eval = FloatField()

    class Meta:
        database = db
    def binary_base64(self):
        return base64.b64encode(self.binary)

db.connect()

eval = Evaluations.get(Evaluations.id == 1)
print(eval.fen)

class EvaluationDataset(IterableDataset):
    def __init__(self, count):
        self.count = count
    def __iter__(self):
        return self
    def __next__(self):
        return self[random.randrange(0, self.count)]
    def __len__(self):
        return self.count
    def __getitem__(self, index):
        eval = Evaluations.get(Evaluations.id == index+1)
        bin = np.frombuffer(eval.binary, dtype=np.uint8)
        bin = np.unpackbits(bin, axis=0).astype(np.single)
        eval.eval = max(eval.eval, -15)
        eval.eval = min(eval.eval, 15)
        ev = np.array([eval.eval]).astype(np.single)
        return {"binary":bin, "eval":ev}

class Model(pl.LightningModule):
    def __init__(self, learning_rate=1e-3,batch_size=1024,layer_count=10):
        super().__init__()
        self.learning_rate = learning_rate
        self.batch_size = batch_size
        self.layer_count = layer_count
        layers = []
        for i in range(layer_count - 1):
            layers.append((f"linear-{i}", nn.Linear(808,808)))
            layers.append((f"relu-{i}", nn.ReLU()))
        layers.append((f"linear-{layer_count-1}", nn.Linear(808,1)))
        self.seq = nn.Sequential(OrderedDict(layers))
    
    def forward(self, x):
        return self.seq(x)
    
    def training_step(self, batch, batch_index):
        x = batch["binary"]
        y = batch["eval"]
        y_hat = self(x)
        loss = F.l1_loss(y_hat, y)
        self.log("training_loss", loss)
        return loss
    
    def configure_optimizers(self):
        return torch.optim.Adam(self.parameters(), lr=self.learning_rate)

    def train_dataloader(self):
        dataset = EvaluationDataset(count=37164639)
        return DataLoader(dataset, batch_size=self.batch_size, num_workers=0, pin_memory=True)

LABEL_COUNT = 37164639

model = Model(layer_count=4)
trainer = pl.Trainer(precision=16,max_epochs=1,auto_lr_find=True)
trainer.fit(model)