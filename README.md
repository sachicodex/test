# 🎨 Animated Website with Smooth Scrolling

A modern, animated website featuring smooth scrolling, scroll-triggered animations, and interactive hover effects.

## ✨ Features

### 🎭 Animations
- **Entrance Animations**: Fade-in, slide-in, scale-in, and bounce-in effects
- **Hover Animations**: Lift, scale, and glow effects on interactive elements
- **Scroll Animations**: Elements animate in as they come into view
- **Staggered Animations**: Grid items animate in sequence for visual appeal
- **Loading Animations**: Spinning, pulsing, and shimmer effects

### 🚀 Smooth Scrolling
- **CSS Smooth Scrolling**: Native smooth scrolling behavior
- **JavaScript Enhanced**: Custom smooth scrolling for anchor links
- **Performance Optimized**: Throttled scroll handlers for 60fps performance

### 🎯 Interactive Elements
- **Sidebar**: Animated navigation with hover effects
- **Cards**: Interactive stat cards and video cards
- **Buttons**: Enhanced button interactions with loading states
- **Search**: Animated search input with focus effects

## 🛠️ Usage

### CSS Animation Classes

#### Basic Animations
```css
.animate-fade-in          /* Fade in from bottom */
.animate-slide-in-right   /* Slide in from right */
.animate-slide-in-left    /* Slide in from left */
.animate-slide-in-up      /* Slide in from bottom */
.animate-scale-in         /* Scale in from 0.8 */
.animate-bounce-in        /* Bounce in effect */
.animate-float            /* Continuous floating */
.animate-pulse-glow       /* Pulsing glow effect */
.animate-shimmer          /* Shimmer effect */
.animate-rotate-3d        /* 3D rotation */
```

#### Staggered Delays
```css
.animate-delay-100        /* 0.1s delay */
.animate-delay-200        /* 0.2s delay */
.animate-delay-300        /* 0.3s delay */
.animate-delay-400        /* 0.4s delay */
.animate-delay-500        /* 0.5s delay */
```

#### Hover Effects
```css
.hover-lift              /* Lift on hover */
.hover-scale             /* Scale on hover */
.hover-glow              /* Glow on hover */
```

#### Scroll Animations
```css
.scroll-animate          /* Fade in on scroll */
.scroll-animate-left     /* Slide in from left on scroll */
.scroll-animate-right    /* Slide in from right on scroll */
.scroll-animate-scale    /* Scale in on scroll */
```

### JavaScript API

#### Animation Controller
```javascript
// Add animation class to element
AnimationController.addAnimationClass(element, 'animate-fade-in');

// Initialize scroll animations
AnimationController.initScrollAnimations();

// Initialize parallax effects
AnimationController.initParallaxEffects();

// Initialize hover animations
AnimationController.initHoverAnimations();
```

#### Custom Animations
```javascript
// Add custom scroll animation
const element = document.querySelector('.my-element');
element.classList.add('scroll-animate');

// Add parallax effect
const parallaxElement = document.querySelector('.parallax');
parallaxElement.dataset.speed = '0.5'; // Adjust speed
```

## 📁 File Structure

```
├── css/
│   └── style.css          # Main stylesheet with animations
├── js/
│   └── animations.js      # Animation controller and utilities
├── index.html             # Demo page
└── README.md              # This file
```

## 🎨 Customization

### Animation Timing
Modify CSS custom properties in `:root`:
```css
--transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
--transition-spring: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

### Animation Delays
Adjust staggered animation delays:
```css
.stats-grid .stat-card:nth-child(1) { animation-delay: 0.1s; }
.stats-grid .stat-card:nth-child(2) { animation-delay: 0.2s; }
/* ... */
```

### Performance
- Uses `requestAnimationFrame` for smooth animations
- Throttled scroll handlers for optimal performance
- CSS transforms for hardware acceleration

## 🌟 Browser Support

- **Modern Browsers**: Full support for all animations
- **CSS Animations**: IE10+ (with reduced functionality)
- **Smooth Scrolling**: All modern browsers
- **Intersection Observer**: IE11+ (with polyfill)

## 🚀 Getting Started

1. **Include the CSS**:
   ```html
   <link rel="stylesheet" href="css/style.css">
   ```

2. **Include the JavaScript**:
   ```html
   <script src="js/animations.js"></script>
   ```

3. **Add animation classes** to your elements:
   ```html
   <div class="animate-fade-in">Content</div>
   <div class="scroll-animate">Scroll-triggered content</div>
   ```

4. **Initialize animations** (optional, auto-initializes):
   ```javascript
   document.addEventListener('DOMContentLoaded', function() {
       // Animations auto-initialize
   });
   ```

## 🎯 Examples

### Basic Fade In
```html
<div class="animate-fade-in">
    This will fade in when the page loads
</div>
```

### Scroll-Triggered Animation
```html
<div class="scroll-animate">
    This will animate when scrolled into view
</div>
```

### Staggered Grid Animation
```html
<div class="stats-grid">
    <div class="stat-card">Item 1</div>
    <div class="stat-card">Item 2</div>
    <div class="stat-card">Item 3</div>
</div>
```

### Parallax Effect
```html
<div class="parallax" data-speed="0.5">
    This will move at half the scroll speed
</div>
```

## 🔧 Advanced Usage

### Custom Keyframes
```css
@keyframes my-custom-animation {
    0% { transform: scale(0); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
}

.my-element {
    animation: my-custom-animation 1s ease-out;
}
```

### Intersection Observer
```javascript
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
});

observer.observe(document.querySelector('.my-element'));
```

## 📱 Responsive Design

All animations are responsive and work on:
- Desktop computers
- Tablets
- Mobile devices
- Touch interfaces

## 🎨 Performance Tips

1. **Use CSS transforms** instead of changing layout properties
2. **Limit simultaneous animations** to maintain 60fps
3. **Use `will-change`** for elements that will animate
4. **Throttle scroll events** for smooth performance
5. **Prefer CSS animations** over JavaScript when possible

## 🤝 Contributing

Feel free to:
- Add new animation types
- Improve performance
- Add more examples
- Fix bugs or issues

## 📄 License

This project is open source and available under the MIT License.

---

**Enjoy creating beautiful, animated websites! 🎉**


