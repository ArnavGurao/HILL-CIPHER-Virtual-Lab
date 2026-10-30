# Hill Cipher using Matrix Operations

## Experiment Information

**Experiment Name:** Hill Cipher using Matrix Operations  
**Folder:** `/experiments/hill-cipher/`  
**Entry File:** `index.html`  
**Navigation Title:** Hill Cipher  
**Required Libraries:** None  

### Short Description

An interactive virtual cryptography experiment that explains the Hill Cipher,
shows correct matrix-based encryption and decryption procedures, studies key
invertibility modulo 26, and records successful simulation runs.

## Input

### Encryption
- Plaintext
- 2×2 key matrix

### Decryption
- Ciphertext
- 2×2 key matrix

## Output

- Ciphertext
- Plaintext
- Step-by-step matrix calculations
- Key determinant
- gcd invertibility check
- Modular inverse
- Inverse key matrix
- Stored test records

## Main Interface Structure

The application is segmented. The left navigation displays one section at a time:

1. Aim & Objectives
2. Theory
3. Procedure
4. Simulation
5. Test Records
6. Quiz & Self Assessment
7. References

## Theory Features

- Lester S. Hill history section
- Provided portrait image under `assets/lester-hill.png`
- Interactive concept tabs
- Hoverable concept/objective cards
- History timeline
- Mathematical formulas
- Advantages and limitations
- Known-plaintext attack explanation

## Procedure

The Procedure section contains separate Encryption and Decryption tabs.

### Encryption Formula

`C = K × P (mod 26)`

### Decryption Formula

`P = K⁻¹ × C (mod 26)`

### Key Invertibility

For decryption:

`gcd(det(K), 26) = 1`

must hold.

Both procedures contain:
- Horizontal flowcharts
- Step-by-step process
- Pseudocode algorithm

## Simulation

The Simulation page first asks:

**What do you want to do?**

The user selects:
- Encryption
- Decryption

Only the selected simulation is shown.

### Encryption Simulation Features

- Plaintext cleaning
- X padding for odd-length text
- A=0 to Z=25 mapping
- 2-letter block creation
- Matrix multiplication
- Modulo 26
- Previous / Next / Play walkthrough
- Automatic encryption test record

Example:

Plaintext: `HELP`

Key:

```text
[3 3]
[2 5]
```

Ciphertext: `HIAT`

### Decryption Simulation Features

- Key invertibility check
- Determinant
- gcd(det(K), 26)
- Modular inverse
- Inverse key matrix
- Ciphertext block conversion
- Matrix multiplication
- Previous / Next / Play walkthrough
- Final plaintext
- Automatic decryption test record

Example:

Ciphertext: `HIAT`

Key:

```text
[3 3]
[2 5]
```

Plaintext: `HELP`

## Test Records

Successful simulation runs are recorded in two separate tables:

### Encryption Records

- Original plaintext
- Processed plaintext
- Key
- Ciphertext
- Time

### Decryption Records

- Ciphertext
- Key
- Decrypted output
- Invertibility status
- Time

The records are stored using browser `localStorage` and can be cleared from the
Test Records page.

## Quiz & Self Assessment

The Quiz section helps students test their understanding of the Hill Cipher and related cryptographic concepts.

Features:

- Multiple-choice questions
- Instant answer verification
- Covers encryption and decryption concepts
- Tests knowledge of matrix operations
- Helps students perform self-assessment

Topics Covered:

- Lester S. Hill
- Matrix Operations
- Alphabet Mapping (A=0 to Z=25)
- Encryption Formula
- Key Invertibility
- Modulo 26 Arithmetic
- Plaintext and Ciphertext
- Security Limitations of Hill Cipher


## Files

```text
hill_cipher_complete_segmented/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    └── lester-hill.png
```

## How to Run

No web server or external library is required.

1. Extract the folder.
2. Open `index.html` in a modern browser.
3. Use the left menu to move between experiment segments.

## References

1. Lester S. Hill, “Cryptography in an Algebraic Alphabet,” *The American Mathematical Monthly*, 1929.
2. NIST, FIPS 197 — Advanced Encryption Standard (AES).
3. Standard cryptography and network security textbooks for classical-cipher and modular-arithmetic background.

## Integration Notes

This module is self-contained and does not modify the parent application.
The integration team can place the folder under `/experiments/hill-cipher/` and
link to `/experiments/hill-cipher/`.
