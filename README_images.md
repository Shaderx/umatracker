# Race Images Downloader

This script downloads all race images from the `RaceComplete.csv` file to a local `race_images` subfolder.

## Features

- Downloads all race images from the CSV file's "Image Link" column
- Creates a `race_images` subfolder automatically
- Skips already downloaded images (no re-downloading)
- Preserves original image filenames (e.g., `i_race1.png`, `i_race2.png`)
- Includes progress tracking and detailed summary
- Respectful to server with 0.5 second delays between downloads

## Requirements

Install the required dependency:
```bash
pip install -r requirements.txt
```

## Usage

Simply run the script:
```bash
python download_race_images.py
```

## Script Output

The script will:
1. Create a `race_images` folder if it doesn't exist
2. Process each row in the CSV file
3. Download missing images
4. Skip already downloaded images
5. Show a summary with counts of downloaded, skipped, and failed images

## Example Output

```
Downloaded: 296 images
Skipped (already exist): 109 images
Failed: 0 images
Total processed: 405 images
Images saved in: race_images/
```

## Notes

- Images are downloaded with their original filenames from the URLs
- The script respects the server by adding a 0.5 second delay between downloads
- Images are linked to specific races, so filename preservation is important
- Running the script multiple times is safe - it won't re-download existing images



