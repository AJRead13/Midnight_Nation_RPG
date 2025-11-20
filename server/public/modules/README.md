# Module Images and Maps Guide

## Adding Images and Maps to Handouts

You can now include images and maps in your module handouts. Place your image files in the `/modules/images/` directory and reference them in your module JSON.

### Directory Structure

```
server/public/modules/
├── the-awakening.json
├── images/
│   ├── the-awakening/
│   │   ├── cult-symbol.jpg
│   │   ├── city-map.png
│   │   ├── warehouse-floorplan.jpg
│   │   └── ...
│   └── shadow-protocol/
│       └── ...
└── README.md
```

### Handout JSON Format

#### Text-Only Handout
```json
{
  "title": "Newspaper Clipping",
  "content": "VETERAN FOUND DEAD IN ALLEY - Police baffled..."
}
```

#### Handout with Image
```json
{
  "title": "Cult Symbol",
  "content": "Three-pointed star within circle. Points labeled (in Latin): Corpus, Anima, Daemon.",
  "image": "/modules/images/the-awakening/cult-symbol.jpg",
  "imageCaption": "Symbol found carved into the warehouse floor"
}
```

#### Handout with Map
```json
{
  "title": "City District Map",
  "content": "This map shows the Theater District where most supernatural activity has been reported.",
  "map": "/modules/images/the-awakening/city-map.png",
  "mapCaption": "Theater District - September 1947"
}
```

#### Handout with Both Image and Map
```json
{
  "title": "Warehouse Layout",
  "content": "The abandoned warehouse has three levels. Reports indicate cult activity on the basement level.",
  "image": "/modules/images/the-awakening/warehouse-exterior.jpg",
  "imageCaption": "Warehouse exterior, taken from across the street",
  "map": "/modules/images/the-awakening/warehouse-floorplan.jpg",
  "mapCaption": "Warehouse floor plan - All levels"
}
```

### Supported Image Formats
- JPG/JPEG
- PNG
- WebP
- GIF (static)

### Recommended Image Specifications
- **Photos/Artwork**: 1200px wide, optimized for web (70-80% quality)
- **Maps**: 1500-2000px wide for detail, high resolution
- **File Size**: Try to keep under 500KB per image for faster loading

### Image Best Practices
1. Use descriptive filenames: `theater-district-map.png` not `map1.png`
2. Optimize images before uploading (use tools like TinyPNG, ImageOptim)
3. Test images on mobile devices for readability
4. Include captions for context
5. Maps should be high enough resolution to zoom in for details

### PDF Export
Images and maps are automatically included when generating PDFs from the module viewer. They will maintain their quality and layout in the exported document.

### Example Implementation

See `the-awakening.json` for a complete example module with handouts. To add images to it:

1. Create directory: `server/public/modules/images/the-awakening/`
2. Add your image files to that directory
3. Update the handout entries in `the-awakening.json` to reference the images
4. Images will automatically display in the module viewer and PDF exports

