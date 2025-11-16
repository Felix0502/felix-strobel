#!/usr/bin/env python3
"""
Sync Mobile Projects Script
============================
Synchronisiert automatisch die Mobile-Projektseiten mit den Desktop-Versionen
aus der index.html. Stellt sicher, dass Bilder, Videos und Texte immer identisch sind.

Verwendung:
    python3 sync-mobile-projects.py

Das Script extrahiert Projekt-Daten aus index.html und aktualisiert:
- project-coworker.html
- project-momox.html
- project-ai-agents.html
- project-ai-shopping.html
"""

import re
import json
import sys

# Project mapping
PROJECT_MAPPING = {
    'coworker': 'project-1',
    'momox': 'project-2',
    'ai-agents': 'project-3',
    'ai-shopping': 'project-4'
}

MOBILE_FILES = {
    'coworker': 'project-coworker.html',
    'momox': 'project-momox.html',
    'ai-agents': 'project-ai-agents.html',
    'ai-shopping': 'project-ai-shopping.html'
}

def extract_project_data(html_content, project_id):
    """Extract all relevant data from a project section"""
    # Find project section
    pattern = rf'<div id="{project_id}"[^>]*>.*?(?=<div id="project-\d+"|<section id="interests")'
    match = re.search(pattern, html_content, re.DOTALL)
    
    if not match:
        return None
    
    project_html = match.group(0)
    data = {}
    
    # Hero image/video
    hero_video = re.search(r'<div class="project__hero-video">.*?<source src="([^"]+)"', project_html, re.DOTALL)
    hero_image = re.search(r'<div class="project__hero-image"[^>]*style="[^"]*url\(\'([^\']+)\'\)', project_html)
    
    if hero_video:
        data['hero_type'] = 'video'
        data['hero_src'] = hero_video.group(1)
    elif hero_image:
        data['hero_type'] = 'image'
        data['hero_src'] = hero_image.group(1)
    
    # Title
    title_match = re.search(r'<h1 class="hero__title">([^<]+)</h1>', project_html)
    if title_match:
        data['title'] = title_match.group(1).strip()
    
    # Tags
    tags = re.findall(r'<div class="project-tag">([^<]+)</div>', project_html)
    data['tags'] = tags
    
    # First slider
    first_slider_pattern = r'<!-- Slider Section 1 -->.*?<div class="project__slider-images">(.*?)</div>\s*<div class="project__slider-nav">'
    first_slider_match = re.search(first_slider_pattern, project_html, re.DOTALL)
    
    if first_slider_match:
        slider_html = first_slider_match.group(1)
        slides = []
        
        # Find all slides
        slide_pattern = r'<div class="project__slide"[^>]*>.*?(?=<div class="project__slide"|</div>\s*<div class="project__slider-nav"|$)'
        slide_matches = re.finditer(slide_pattern, slider_html, re.DOTALL)
        
        for slide_match in slide_matches:
            slide_html = slide_match.group(0)
            slide_data = {}
            
            # Image
            img_match = re.search(r'<div class="project__slide-image"[^>]*style="[^"]*url\(\'([^\']+)\'\)', slide_html)
            if img_match:
                slide_data['image'] = img_match.group(1)
            
            # Video
            video_match = re.search(r'<source src="([^"]+)"', slide_html)
            if video_match:
                slide_data['video'] = video_match.group(1)
            
            # Title
            title_match = re.search(r'<h4 class="project__slide-title">.*?<span>([^<]+)</span>', slide_html, re.DOTALL)
            if title_match:
                slide_data['title'] = title_match.group(1).strip()
            
            # Description
            desc_match = re.search(r'<p class="project__slide-description">([^<]+)</p>', slide_html)
            if desc_match:
                slide_data['description'] = desc_match.group(1).strip()
            
            if slide_data:
                slides.append(slide_data)
        
        data['first_slider'] = slides
    
    return data

def update_mobile_project(slug, data):
    """Update a mobile project HTML file"""
    filename = MOBILE_FILES[slug]
    
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"  ✗ File not found: {filename}")
        return False
    
    # Update hero image/video
    if data.get('hero_type') == 'image':
        pattern = r'<div class="project__hero-image"[^>]*style="[^"]*">'
        replacement = f'<div class="project__hero-image" style="background-image: url(\'{data["hero_src"]}\'); background-size: cover; background-position: center;">'
        content = re.sub(pattern, replacement, content)
        print(f"  ✓ Hero image: {data['hero_src']}")
    
    elif data.get('hero_type') == 'video':
        old_hero_pattern = r'<div class="project__hero-(?:image|video)"[^>]*>.*?</div>'
        video_html = f'''<div class="project__hero-video">
                        <video autoplay muted loop playsinline>
                            <source src="{data['hero_src']}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    </div>'''
        content = re.sub(old_hero_pattern, video_html, content, count=1, flags=re.DOTALL)
        print(f"  ✓ Hero video: {data['hero_src']}")
    
    # Update title
    if 'title' in data:
        pattern = r'<h1 class="hero__title">[^<]*</h1>'
        replacement = f'<h1 class="hero__title">{data["title"]}</h1>'
        content = re.sub(pattern, replacement, content, count=1)
        print(f"  ✓ Title: {data['title']}")
    
    # Update first slider
    if 'first_slider' in data and data['first_slider']:
        slides = data['first_slider']
        first_slider_pattern = r'(<!-- Slider Section 1 -->.*?<div class="project__slider-images">)(.*?)(</div>\s*<div class="project__slider-nav">)'
        
        def replace_slider(match):
            before = match.group(1)
            after = match.group(3)
            
            slides_html = '\n'
            for i, slide in enumerate(slides):
                if 'image' in slide:
                    media_html = f'<div class="project__slide-image" style="background-image: url(\'{slide["image"]}\'); background-size: cover; background-position: center;"></div>'
                elif 'video' in slide:
                    media_html = f'''<div class="project__slide-video">
                                            <video muted loop playsinline>
                                                <source src="{slide['video']}" type="video/mp4">
                                            </video>
                                        </div>'''
                else:
                    media_html = '<div class="project__slide-image"></div>'
                
                slide_html = f'''                                    <div class="project__slide" data-slide="{i}">
                                        {media_html}
                                        <h4 class="project__slide-title">
                                            <span>{slide.get('title', f'Bild Titel {i+1}')}</span>
                                            <span class="material-symbols-outlined project__slide-title-toggle">keyboard_arrow_down</span>
                                        </h4>
                                        <p class="project__slide-description">{slide.get('description', 'Lorem ipsum dolor sit amet.')}</p>
                                    </div>
'''
                slides_html += slide_html
            
            return before + slides_html + '                                ' + after
        
        content = re.sub(first_slider_pattern, replace_slider, content, count=1, flags=re.DOTALL)
        print(f"  ✓ Slider: {len(slides)} slides")
    
    # Write updated content
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return True

def main():
    """Main sync function"""
    print("=" * 60)
    print("  SYNC MOBILE PROJECTS")
    print("=" * 60)
    
    # Read index.html
    try:
        with open('index.html', 'r', encoding='utf-8') as f:
            html_content = f.read()
    except FileNotFoundError:
        print("✗ Error: index.html not found!")
        print("  Make sure to run this script from the portfolio root directory.")
        sys.exit(1)
    
    # Extract data from all projects
    print("\n[1/2] Extracting project data from index.html...")
    projects_data = {}
    for slug, project_id in PROJECT_MAPPING.items():
        data = extract_project_data(html_content, project_id)
        if data:
            projects_data[slug] = data
            print(f"  ✓ {slug}: {len(data.get('first_slider', []))} slides")
    
    # Update mobile files
    print(f"\n[2/2] Updating {len(MOBILE_FILES)} mobile project pages...")
    success_count = 0
    for slug, data in projects_data.items():
        if slug in MOBILE_FILES:
            print(f"\n{MOBILE_FILES[slug]}:")
            if update_mobile_project(slug, data):
                success_count += 1
    
    # Summary
    print("\n" + "=" * 60)
    if success_count == len(MOBILE_FILES):
        print(f"✅ SUCCESS: All {success_count} mobile pages synchronized!")
    else:
        print(f"⚠️  WARNING: Only {success_count}/{len(MOBILE_FILES)} pages updated")
    print("=" * 60)

if __name__ == '__main__':
    main()





