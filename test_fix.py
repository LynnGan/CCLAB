"""
Test to verify the pandas delim_whitespace deprecation fix.
"""

import pandas as pd
import warnings
import sys
import tempfile
import os

# Test data
test_data = """1.0  2.0  3.0
4.0  5.0  6.0
7.0  8.0  9.0"""

# Create a temporary file for testing (cross-platform compatible)
with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
    test_file_path = f.name
    f.write(test_data)

try:
    print("Testing pandas delim_whitespace deprecation fix...")
    print("-" * 60)

    # Test 1: Verify that using sep=r'\s+' works without warnings
    print("\nTest 1: Using sep=r'\\s+' (correct approach)")
    with warnings.catch_warnings(record=True) as w:
        warnings.simplefilter("always")
        df1 = pd.read_csv(test_file_path, sep=r'\s+', header=None)
        
        if len(w) == 0:
            print("✓ No warnings generated")
        else:
            print(f"✗ Unexpected warnings: {[str(warning.message) for warning in w]}")
            sys.exit(1)

    print(f"  Data shape: {df1.shape}")
    print(f"  First row: {df1.iloc[0].tolist()}")

    # Test 2: Verify that the data is loaded correctly
    print("\nTest 2: Data integrity check")
    expected_values = [[1.0, 2.0, 3.0], [4.0, 5.0, 6.0], [7.0, 8.0, 9.0]]
    for i, expected_row in enumerate(expected_values):
        actual_row = df1.iloc[i].tolist()
        if actual_row == expected_row:
            print(f"✓ Row {i}: {actual_row} matches expected")
        else:
            print(f"✗ Row {i}: {actual_row} does not match {expected_row}")
            sys.exit(1)

    print("\n" + "-" * 60)
    print("All tests passed! ✓")
    print("\nSummary:")
    print("  - The fix (sep=r'\\s+') correctly replaces delim_whitespace=True")
    print("  - No deprecation warnings are generated")
    print("  - Data is loaded correctly")

finally:
    # Clean up the temporary file
    if os.path.exists(test_file_path):
        os.unlink(test_file_path)
