# Pine App Theme Guide 🍍

## Pineapple Design System

Pine App uses a custom **Pineapple Theme** with vibrant, tropical colors inspired by the pineapple fruit. This creates a fresh, energetic, and memorable brand identity for our financial and training management system.

## Color Palette

### Primary Colors
- **Pine Yellow**: `#ffd93d` - Main brand color (pineapple body)
- **Pine Green**: `#6bcf63` - Secondary brand color (pineapple leaves)
- **Pine Orange**: `#ff9f40` - Accent color (tropical warmth)
- **Pine Brown**: `#8b6f47` - Tertiary color (pineapple texture)

### CSS Variables
All colors are available as CSS custom properties:

```css
var(--pine-yellow)
var(--pine-green)
var(--pine-orange)
var(--pine-primary)
var(--pine-secondary)
var(--pine-accent)
```

### Gradients
```css
var(--pine-gradient-primary)     /* Yellow to Orange */
var(--pine-gradient-secondary)   /* Green gradient */
var(--pine-gradient-tropical)    /* Yellow → Orange → Green */
```

## Usage for Teams

### Buttons
```html
<!-- Primary Button -->
<button class="pine-btn pine-btn-primary">Create Enrollment</button>

<!-- Secondary Button -->
<button class="pine-btn pine-btn-secondary">Approve PO</button>

<!-- Outline Button -->
<button class="pine-btn pine-btn-outline">Cancel</button>
```

### Cards
```html
<!-- Standard Card -->
<div class="pine-card">
  <h3>Enrollment Details</h3>
  <p>Content goes here...</p>
</div>

<!-- Tropical Card (highlighted) -->
<div class="pine-card pine-card-tropical">
  <h3>Featured Training</h3>
  <p>Special content...</p>
</div>
```

### Inputs
```html
<input type="text" class="pine-input" placeholder="Enter client name" />
```

### Badges
```html
<span class="pine-badge pine-badge-success">APPROVED</span>
<span class="pine-badge pine-badge-warning">PENDING</span>
<span class="pine-badge pine-badge-error">REJECTED</span>
<span class="pine-badge pine-badge-primary">NEW</span>
```

### Backgrounds
```html
<div class="pine-bg-primary">Yellow gradient background</div>
<div class="pine-bg-secondary">Green gradient background</div>
<div class="pine-bg-tropical">Full tropical gradient</div>
```

### Text Gradients
```html
<h1 class="pine-text-primary">Gradient Text Heading</h1>
```

## Layout Utilities

### Container
```html
<div class="pine-container">
  <!-- Content will be centered with max-width: 1280px -->
</div>
```

### Section Spacing
```html
<section class="pine-section">
  <!-- Proper vertical padding -->
</section>
```

## Status Colors

For enrollment/PO/invoice statuses:

```html
<span class="pine-status-requested">REQUESTED</span>
<span class="pine-status-approved">APPROVED</span>
<span class="pine-status-ongoing">ONGOING</span>
<span class="pine-status-completed">COMPLETED</span>
```

## Animations

```html
<div class="pine-animate-pulse">Pulsing element</div>
<div class="pine-animate-spin">Spinning loader</div>
<div class="pine-animate-bounce">Bouncing notification</div>
```

## Best Practices

1. **Always use theme variables** instead of hardcoded colors
2. **Use utility classes** for common patterns (buttons, cards, badges)
3. **Maintain consistency** across your module/feature
4. **Test accessibility** - all contrast ratios meet WCAG AA standards
5. **Responsive by default** - theme adapts to mobile screens

## Team Examples

### Admin - Enrollment Dashboard
```html
<div class="pine-container pine-section">
  <h1 class="pine-text-primary">Enrollment Management</h1>
  
  <div class="pine-card">
    <h3>Client: TechCorp Inc.</h3>
    <span class="pine-badge pine-badge-success">APPROVED</span>
    <button class="pine-btn pine-btn-primary">Generate PO</button>
  </div>
</div>
```

### Trainer - Invoice Upload
```html
<div class="pine-card pine-card-tropical">
  <h3>Upload Invoice</h3>
  <input type="file" class="pine-input" />
  <button class="pine-btn pine-btn-secondary">Submit Invoice</button>
</div>
```

## Questions?

If you need custom styles beyond these utilities, ask the **Project Manager/Auth Owner** before creating new patterns. We want to maintain consistency!

---

**🍍 Keep it tropical! Keep it Pine!**
