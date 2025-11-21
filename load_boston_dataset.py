"""
Script to load the Boston Housing dataset from the CMU StatLib repository.

This script demonstrates the correct way to load whitespace-delimited data
using pandas, replacing the deprecated 'delim_whitespace' parameter with 'sep'.
"""

import numpy as np
import pandas as pd

# URL to the Boston Housing dataset
data_url = "http://lib.stat.cmu.edu/datasets/boston"

# Load the data using sep=r'\s+' instead of the deprecated delim_whitespace=True
# \s+ matches one or more whitespace characters (spaces, tabs, etc.)
raw_df = pd.read_csv(
    data_url,
    sep=r'\s+',  # Replaces delim_whitespace=True (use raw string to avoid escape warnings)
    skiprows=22,
    header=None
)

# The original parsing scheme for the Boston dataset
# The data is structured with features split across two rows
X = np.hstack([raw_df.values[::2, :], raw_df.values[1::2, :2]])
y = raw_df.values[1::2, 2]

print("Boston Housing Dataset loaded successfully!")
print(f"Features shape: {X.shape}")
print(f"Target shape: {y.shape}")
print(f"\nFirst 5 samples:\n{X[:5]}")
print(f"\nFirst 5 targets:\n{y[:5]}")
