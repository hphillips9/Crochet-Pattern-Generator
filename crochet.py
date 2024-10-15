from PIL import Image, ImageDraw
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans

def rgb_to_hex(rgb):
    return "#{:02x}{:02x}{:02x}".format(int(rgb[0]), int(rgb[1]), int(rgb[2]))

def create_coloured_image(image_path, grid_size, num_of_colours):
    image = Image.open(image_path)
    image_size_x,image_size_y = grid_size
    size_x = image_size_x*10
    size_y = image_size_y*10
    #if image_size_x > 750:
    #    original_size_x = image_size_x
     #   image_size_x = 750
      #  image_size_y = int(image_size_y / (original_size_x / 750))
    
    #if image_size_y > 750:
     #   original_size_y = image_size_y
      #  image_size_y = 750
       # image_size_x = int(image_size_x / (original_size_y / 750))

    resized = image.resize((size_x,size_y), Image.Resampling.BICUBIC)
    alt_image = resized.convert('RGB')

    pixel_data = np.array(alt_image)
    pixels = pixel_data.reshape((-1,3))

    kmeans = KMeans(n_clusters=num_of_colours, random_state=42)
    kmeans.fit(pixels)

    palette = kmeans.cluster_centers_.astype(int)

    new_pixels = palette[kmeans.labels_] 
    new_pixels = new_pixels.reshape(pixel_data.shape) 
    hex_colours = [rgb_to_hex(colour) for colour in palette]
    quantized_image = Image.fromarray(new_pixels.astype('uint8'), 'RGB')
    return quantized_image, hex_colours


def create_pattern(quantized_image):
    pixel_data = np.array(quantized_image)
    grid_image = Image.new('RGB', quantized_image.size)
    draw = ImageDraw.Draw(grid_image)

    for y in range(0,quantized_image.height, 10):
        for x in range(0,quantized_image.width, 10):
            block = pixel_data[y:y+10, x:x+10]

            avg_colour = np.mean(block, axis=(0, 1)).astype(int)

            draw.rectangle([x, y, x+10-1, y+10-1], fill=tuple(avg_colour))

    for x in range(0, quantized_image.width, 10):
        draw.line([(x, 0), (x, quantized_image.height)], fill="black")
    for y in range(0, quantized_image.height, 10):
        draw.line([(0, y), (quantized_image.width, y)], fill="black")
    grid_image.save('static/pattern.png')
    return grid_image

