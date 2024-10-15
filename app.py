from flask import Flask, render_template, request, send_file
import os
from crochet import create_coloured_image, create_pattern
from PIL import Image
import io
import math, webcolors

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process', methods=['POST'])
def process_image():
    if 'file' not in request.files:
        return "No file uploaded!", 400

    file = request.files['file']
    
    if file.filename == '':
        return "No file selected!", 400
    if file:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filepath)

        num_of_colours = int(request.form['num_of_colours'])

        num_rows = int(request.form['num_rows'])
        num_cols = int(request.form['num_cols'])

        processed_image, colours = create_coloured_image(filepath, grid_size=(num_rows,num_cols), num_of_colours=num_of_colours)
        processed_grid = create_pattern(processed_image)
        img_io = io.BytesIO()
        processed_grid.save(img_io, 'PNG')
        img_io.seek(0)

        # Save the processed image to static for download
        processed_image_path = os.path.join('static', file.filename + 'pattern.png')
        processed_grid.save(processed_image_path)
        return render_template('result.html',colors=colours, num_cols=num_cols, num_rows=num_rows)


if __name__ == '__main__':
    app.run(debug=True)
