#!/usr/bin/env python3
"""
Script to download race images from RaceComplete.csv
Downloads images to a 'race_images' subfolder, skipping already downloaded files.
"""

import csv
import os
import requests
from urllib.parse import urlparse
import time

def create_images_folder():
    """Create the race_images folder if it doesn't exist"""
    folder_name = "race_images"
    if not os.path.exists(folder_name):
        os.makedirs(folder_name)
        print(f"Created folder: {folder_name}")
    else:
        print(f"Folder already exists: {folder_name}")
    return folder_name

def get_filename_from_url(url):
    """Extract filename from URL"""
    parsed_url = urlparse(url)
    return os.path.basename(parsed_url.path)

def download_image(url, filepath):
    """Download image from URL to filepath"""
    try:
        response = requests.get(url, stream=True, timeout=30)
        response.raise_for_status()
        
        with open(filepath, 'wb') as file:
            for chunk in response.iter_content(chunk_size=8192):
                file.write(chunk)
        
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error downloading {url}: {e}")
        return False

def main():
    csv_file = "RaceComplete.csv"
    images_folder = create_images_folder()
    
    if not os.path.exists(csv_file):
        print(f"Error: {csv_file} not found!")
        return
    
    downloaded_count = 0
    skipped_count = 0
    failed_count = 0
    
    print("Starting image download...")
    
    with open(csv_file, 'r', encoding='utf-8') as file:
        csv_reader = csv.reader(file)
        headers = next(csv_reader)  # Skip header row
        
        # Find the Image Link column (should be the last column)
        image_link_index = len(headers) - 1
        print(f"Found {len(headers)} columns, using column {image_link_index} for image links")
        
        for row_num, row in enumerate(csv_reader, start=2):
            if len(row) <= image_link_index:
                continue
                
            image_url = row[image_link_index].strip()
            
            # Skip empty URLs
            if not image_url:
                continue
            
            # Get filename from URL
            filename = get_filename_from_url(image_url)
            if not filename:
                print(f"Row {row_num}: Could not extract filename from {image_url}")
                failed_count += 1
                continue
            
            filepath = os.path.join(images_folder, filename)
            
            # Check if file already exists
            if os.path.exists(filepath):
                print(f"Row {row_num}: Skipping {filename} (already exists)")
                skipped_count += 1
                continue
            
            # Download the image
            print(f"Row {row_num}: Downloading {filename}...")
            if download_image(image_url, filepath):
                downloaded_count += 1
                print(f"Row {row_num}: Successfully downloaded {filename}")
            else:
                failed_count += 1
                print(f"Row {row_num}: Failed to download {filename}")
            
            # Add a small delay to be respectful to the server
            time.sleep(0.5)
    
    print("\n" + "="*50)
    print("DOWNLOAD SUMMARY")
    print("="*50)
    print(f"Downloaded: {downloaded_count} images")
    print(f"Skipped (already exist): {skipped_count} images")
    print(f"Failed: {failed_count} images")
    print(f"Total processed: {downloaded_count + skipped_count + failed_count} images")
    print(f"Images saved in: {images_folder}/")

if __name__ == "__main__":
    main()



