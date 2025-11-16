# Project Template Guide

## How to Add a New Project

Copy the following HTML structure and paste it before the closing `</section>` tag of the `#projects` section.

### Template Structure

```html
<!-- PROJECT [NUMBER] -->
<div class="project-section snap-section">
    <div class="project">
        <div class="project__header">
            <span class="project__category">Category Name</span>
            <h3 class="project__title">Your Project Title</h3>
        </div>
        <p class="project__description">
            Your project description goes here. Explain what the project is about, 
            your role, the technologies used, and the impact or results.
        </p>
        <div class="project__meta">
            <span class="project__year">2024</span>
            <span class="project__tags">Tag1 • Tag2 • Tag3</span>
        </div>
    </div>
</div>
```

## Important: Scrollable Sections

Each project section is **scrollable** within the viewport:

- Fixed height: 100vh (full screen)
- Content can be longer than the viewport
- Scroll vertically within each section to see all content
- Padding: 80px top/bottom (40px on mobile)
- Scroll-snap works: snap to section, then scroll within it

Add as much content as you need - you can scroll within each project section!

## Fields to Customize

### 1. Category Name
- **Location:** `.project__category`
- **Example:** "Web Design", "Branding", "Development", "UX/UI"
- **Style:** Uppercase, blue accent color

### 2. Project Title
- **Location:** `.project__title`
- **Example:** "E-Commerce Platform Redesign"
- **Style:** Large, bold heading (48px desktop, 32px mobile)

### 3. Description
- **Location:** `.project__description`
- **Example:** Explain the project context, your role, challenges solved, and results
- **Style:** Body text (18px desktop, 16px mobile)

### 4. Year
- **Location:** `.project__year`
- **Example:** "2024", "2023"
- **Style:** Muted text, medium weight

### 5. Tags
- **Location:** `.project__tags`
- **Example:** "React • TypeScript • Figma" or "Brand Strategy • Visual Identity"
- **Style:** Muted text, separated by bullet points (•)

## Global Styles

All projects automatically inherit these styles from `/assets/css/components.css`:

### Desktop Styles
- Title: 48px, font-weight 600
- Description: 18px, line-height 1.7
- Category: 14px, uppercase, accent color
- Meta: 15px, muted color
- Max-width: 900px
- Padding: 80px left/right

### Mobile Styles (≤480px)
- Title: 32px
- Description: 16px
- Category: 12px
- Meta: 14px
- Padding: 20px left/right

## Example Project

```html
<!-- PROJECT 4 -->
<div class="project-section snap-section">
    <div class="project">
        <div class="project__header">
            <span class="project__category">Web Design</span>
            <h3 class="project__title">Portfolio Website Redesign</h3>
        </div>
        <p class="project__description">
            Complete redesign and development of a personal portfolio website 
            focusing on clean aesthetics and smooth interactions. Built with 
            modern web technologies and optimized for performance.
        </p>
        <div class="project__meta">
            <span class="project__year">2024</span>
            <span class="project__tags">HTML • CSS • JavaScript • p5.js</span>
        </div>
    </div>
</div>
```

## Tips

1. **Keep descriptions concise**: 2-3 sentences work best
2. **Use consistent tag separators**: Always use bullet points (•)
3. **Update the comment**: Change `<!-- PROJECT [NUMBER] -->` to match
4. **Test scroll snap**: Each project should snap to view when scrolling
5. **Check mobile**: Always preview on mobile devices

## Need to Change Global Styles?

Edit these files:
- **Desktop styles:** `/assets/css/components.css` (lines 142-206)
- **Mobile styles:** `/assets/css/components.css` (lines 313-340)

