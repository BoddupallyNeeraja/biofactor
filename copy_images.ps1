# PowerShell script to copy product images from root to correct directories
# This script handles OneDrive file locking issues

Write-Host "Starting image copy process..." -ForegroundColor Green

# Function to copy file with retry logic
function Copy-ImageFile {
    param(
        [string]$SourceFile,
        [string]$DestinationFile
    )
    
    $maxRetries = 3
    $retryCount = 0
    
    while ($retryCount -lt $maxRetries) {
        try {
            if (Test-Path $SourceFile) {
                # Remove read-only attribute if exists
                $sourceItem = Get-Item $SourceFile -ErrorAction SilentlyContinue
                if ($sourceItem) {
                    $sourceItem.Attributes = $sourceItem.Attributes -band (-bnot [System.IO.FileAttributes]::ReadOnly)
                }
                
                # Try to copy
                Copy-Item -Path $SourceFile -Destination $DestinationFile -Force -ErrorAction Stop
                Write-Host "  ✓ Copied: $SourceFile" -ForegroundColor Green
                return $true
            } else {
                Write-Host "  ✗ Source not found: $SourceFile" -ForegroundColor Yellow
                return $false
            }
        } catch {
            $retryCount++
            if ($retryCount -lt $maxRetries) {
                Write-Host "  ⚠ Retry $retryCount/$maxRetries for: $SourceFile" -ForegroundColor Yellow
                Start-Sleep -Seconds 2
            } else {
                Write-Host "  ✗ Failed after $maxRetries attempts: $SourceFile" -ForegroundColor Red
                Write-Host "    Error: $($_.Exception.Message)" -ForegroundColor Red
                return $false
            }
        }
    }
    return $false
}

# Biofertilizers
Write-Host "`nCopying Biofertilizer images..." -ForegroundColor Cyan
$biofertilizers = @(
    @{src="aadhaargold.jpg"; dest="public/images/products/biofertilizers/aadhaargold.jpg"},
    @{src="triple-action-programme.jpg"; dest="public/images/products/biofertilizers/triple-action-programme.jpg"},
    @{src="double-action-programme.jpg"; dest="public/images/products/biofertilizers/double-action-programme.jpg"},
    @{src="g-vam.jpg"; dest="public/images/products/biofertilizers/g-vam.jpg"},
    @{src="iinm-chakra.jpg"; dest="public/images/products/biofertilizers/iinm-chakra.jpg"},
    @{src="k-factor.jpg"; dest="public/images/products/biofertilizers/k-factor.jpg"},
    @{src="n-factor.jpg"; dest="public/images/products/biofertilizers/n-factor.jpg"},
    @{src="p-factor.jpg"; dest="public/images/products/biofertilizers/p-factor.jpg"},
    @{src="potash.jpg"; dest="public/images/products/biofertilizers/potash.jpg"},
    @{src="prithvi.jpg"; dest="public/images/products/biofertilizers/prithvi.jpg"},
    @{src="proceed.jpg"; dest="public/images/products/biofertilizers/proceed.jpg"},
    @{src="zn-factor.jpg"; dest="public/images/products/biofertilizers/zn-factor.jpg"}
)

foreach ($item in $biofertilizers) {
    Copy-ImageFile -SourceFile $item.src -DestinationFile $item.dest
}

# Organic Fertilizers
Write-Host "`nCopying Organic Fertilizer images..." -ForegroundColor Cyan
$organic = @(
    @{src="promote.jpg"; dest="public/images/products/organic/promote.jpg"},
    @{src="sumca.jpg"; dest="public/images/products/organic/sumca.jpg"}
)

foreach ($item in $organic) {
    Copy-ImageFile -SourceFile $item.src -DestinationFile $item.dest
}

# Chemical Fertilizers
Write-Host "`nCopying Chemical Fertilizer images..." -ForegroundColor Cyan
$chemical = @(
    @{src="cambo.jpg"; dest="public/images/products/chemical/cambo.jpg"},
    @{src="copse.jpg"; dest="public/images/products/chemical/copse.jpg"},
    @{src="dfndr.jpg"; dest="public/images/products/chemical/dfndr.jpg"},
    @{src="ferron.jpg"; dest="public/images/products/chemical/ferron.jpg"},
    @{src="magni5.jpg"; dest="public/images/products/chemical/magni5.jpg"},
    @{src="sampoorna-levels.jpg"; dest="public/images/products/chemical/sampoorna-levels.jpg"},
    @{src="trumin.jpg"; dest="public/images/products/chemical/trumin.jpg"},
    @{src="zincum.jpg"; dest="public/images/products/chemical/zincum.jpg"}
)

foreach ($item in $chemical) {
    Copy-ImageFile -SourceFile $item.src -DestinationFile $item.dest
}

# Watersolubles
Write-Host "`nCopying Watersoluble images..." -ForegroundColor Cyan
$watersolubles = @(
    @{src="flowmin-12-61-00.jpg"; dest="public/images/products/watersolubles/flowmin-12-61-00.jpg"},
    @{src="flowmin-13-00-45.jpg"; dest="public/images/products/watersolubles/flowmin-13-00-45.jpg"},
    @{src="flowmin-cn.jpg"; dest="public/images/products/watersolubles/flowmin-cn.jpg"},
    @{src="flowmin-k-23.jpg"; dest="public/images/products/watersolubles/flowmin-k-23.jpg"},
    @{src="flowmin-mkp.jpg"; dest="public/images/products/watersolubles/flowmin-mkp.jpg"},
    @{src="nutrisol-03-37-37.jpg"; dest="public/images/products/watersolubles/nutrisol-03-37-37.jpg"},
    @{src="nutrisol-10-26-26.jpg"; dest="public/images/products/watersolubles/nutrisol-10-26-26.jpg"},
    @{src="nutrisol-10-54-10.jpg"; dest="public/images/products/watersolubles/nutrisol-10-54-10.jpg"},
    @{src="nutrisol-13-40-13.jpg"; dest="public/images/products/watersolubles/nutrisol-13-40-13.jpg"},
    @{src="nutrisol-15-05-30.jpg"; dest="public/images/products/watersolubles/nutrisol-15-05-30.jpg"},
    @{src="nutrisol-19-19-19.jpg"; dest="public/images/products/watersolubles/nutrisol-19-19-19.jpg"},
    @{src="nutrisol-20-20-20.jpg"; dest="public/images/products/watersolubles/nutrisol-20-20-20.jpg"},
    @{src="nutrisol-8-16-24.jpg"; dest="public/images/products/watersolubles/nutrisol-8-16-24.jpg"},
    @{src="zinc-12.jpg"; dest="public/images/products/watersolubles/zinc-12.jpg"},
    @{src="zinc-33.jpg"; dest="public/images/products/watersolubles/zinc-33.jpg"},
    @{src="boroking.jpg"; dest="public/images/products/watersolubles/boroking.jpg"},
    @{src="ch-iron.jpg"; dest="public/images/products/watersolubles/ch-iron.jpg"},
    @{src="magnilife.jpg"; dest="public/images/products/watersolubles/magnilife.jpg"},
    @{src="mns-30.5.jpg"; dest="public/images/products/watersolubles/mns-30.5.jpg"},
    @{src="copse.jpg"; dest="public/images/products/watersolubles/copse.jpg"},
    @{src="ferron.jpg"; dest="public/images/products/watersolubles/ferron.jpg"}
)

foreach ($item in $watersolubles) {
    Copy-ImageFile -SourceFile $item.src -DestinationFile $item.dest
}

# Special Products
Write-Host "`nCopying Special Product images..." -ForegroundColor Cyan
$special = @(
    @{src="agriseal.jpg"; dest="public/images/products/special/agriseal.jpg"},
    @{src="boc.jpg"; dest="public/images/products/special/boc.jpg"},
    @{src="elixir.jpg"; dest="public/images/products/special/elixir.jpg"}
)

foreach ($item in $special) {
    Copy-ImageFile -SourceFile $item.src -DestinationFile $item.dest
}

# CIB Products
Write-Host "`nCopying CIB Product images..." -ForegroundColor Cyan
$cib = @(
    @{src="dfuse.jpg"; dest="public/images/products/cib/dfuse.jpg"},
    @{src="invictus.jpg"; dest="public/images/products/cib/invictus.jpg"},
    @{src="native-neem.jpg"; dest="public/images/products/cib/native-neem.jpg"},
    @{src="neem-sanjeevani.jpg"; dest="public/images/products/cib/neem-sanjeevani.jpg"},
    @{src="nematoff.jpg"; dest="public/images/products/cib/nematoff.jpg"},
    @{src="neolife.jpg"; dest="public/images/products/cib/neolife.jpg"},
    @{src="pentazia.jpg"; dest="public/images/products/cib/pentazia.jpg"}
)

foreach ($item in $cib) {
    Copy-ImageFile -SourceFile $item.src -DestinationFile $item.dest
}

Write-Host "`nImage copy process completed!" -ForegroundColor Green
Write-Host "`nChecking final status..." -ForegroundColor Cyan
$totalImages = (Get-ChildItem -Path "public/images/products" -Recurse -Filter "*.jpg" | Where-Object { $_.Length -gt 0 }).Count
Write-Host "Total images with content: $totalImages" -ForegroundColor Green


