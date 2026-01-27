$gitCandidates = @(
  "C:\Program Files\Git\cmd\git.exe",
  "C:\Program Files\Git\bin\git.exe",
  "C:\Program Files (x86)\Git\cmd\git.exe",
  "C:\Program Files (x86)\Git\bin\git.exe"
)

$git = $gitCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $git) { $git = "git" }

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
& $git add .
& $git commit -m "backup $timestamp"
