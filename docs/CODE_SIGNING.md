# Code Signing

## Windows CI

Windows release signing is wired through `electron-builder`'s standard environment variables.

Required GitHub Actions secrets:

- `WINDOWS_CSC_LINK`: Base64-encoded `.pfx` certificate or a secure HTTPS URL to the certificate.
- `WINDOWS_CSC_KEY_PASSWORD`: Password for the certificate.

When both secrets are present, the Windows release job exposes them as `CSC_LINK` and `CSC_KEY_PASSWORD`, so `electron-builder` signs the generated executable automatically.

## Local Windows Build

```powershell
$env:CSC_LINK = "C:\path\to\certificate.pfx"
$env:CSC_KEY_PASSWORD = "certificate-password"
npm run build
```

## Linux

Linux desktop artifacts are produced by CI as `AppImage`, `.deb`, and `.zip`. Linux code signing is not enabled by default because distribution trust is usually handled by the package repository or release channel rather than an Authenticode-style certificate.
