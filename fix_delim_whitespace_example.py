r"""
Example demonstrating the fix for pandas delim_whitespace deprecation.

This script shows how to replace the deprecated 'delim_whitespace=True' 
parameter with sep=r'\s+' when reading CSV files with pandas.

The warning message was:
    FutureWarning: The 'delim_whitespace' keyword in pd.read_csv is deprecated 
    and will be removed in a future version. Use sep=r'\s+' instead
"""

import pandas as pd

# Path to sample data file with whitespace-separated values
data_file = "sample_boston_data.txt"

print("=" * 70)
print("DEMONSTRATION: Fixing pandas delim_whitespace deprecation")
print("=" * 70)

# OLD WAY (deprecated - will generate FutureWarning):
# df = pd.read_csv(data_file, delim_whitespace=True, header=None)

# NEW WAY (correct approach):
df = pd.read_csv(
    data_file,
    sep=r'\s+',  # Use sep=r'\s+' instead of delim_whitespace=True
    header=None
)

print("\n✓ Data loaded successfully using sep=r'\\s+'")
print(f"\nDataFrame shape: {df.shape}")
print(f"\nFirst few rows:\n{df.head()}")
print("\n" + "=" * 70)
print("SUMMARY:")
print("  - Replace: delim_whitespace=True")
print("  - With:    sep=r'\\s+'")
print("  - Note:    Use raw string (r'..') to avoid escape sequence warnings")
print("=" * 70)
