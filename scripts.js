//create an object which contains all frequently used colors
const colors = {
    "black": "#000",
    "white": "#fff",
    "red": "#f00",
    "blue": "#00f",
    "green": "#0f0",
    "ada-blue": "#336178",
    "ada-red": "#ae485e",
}

//SO The idea is to draw the Barnley's Fractal, or Barnley's Fern using math in JS
//I decided to choose exactly this fractal and this art generally because...
//It reflects the sense of our team name - 
//Even though last point will be "the least", so the smallest, but as Fractal has no end, the last point is unreachable
//It means that the last point drawn on the canvas is not the Least, because it all can be continued
//Thats how it reflects the name of our group - "Last but not Least"

// Note: transformation 1 = stem; trans 2 = small leaflets; trans 3 = left leaflet; trans 4 = right leaflet
const transforms = [
    {a: 0.0, b: 0.0, c: 0.0, d: 0.16, e: 0.0, f: 0.0, p: 0.01}, // trans1
    {a: 0.85, b: 0.04, c: -0.04, d: 0.85, e: 0.0, f: 1.6, p: 0.85}, // trans2
    {a: 0.2, b: -0.26, c: 0.23, d: 0.22, e: 0.0, f: 1.6, p: 0.07}, // trans3
    {a: -0.15, b: 0.28, c: 0.26, d: 0.24, e: 0.0, f: 0.44, p: 0.07}  // trans4
]; // Info is taken from the open sources in the internet

const probabilities = [0.01, 0.86, 0.93, 1.00]; // these are the probabilities of a certain transformation to be plotted

//function for finding the values of next coordinates of X and Y of the next point of the fern
const nextCords = (x, y) => {
    let num = Math.random();
    let t = transforms[0];
    for (let i = 0; i < probabilities.length; i++) {
        if (num < probabilities[i]) {
            t = transforms[i];
            break;
        }
    }
    
    //now that we know which transformation it is, we can get the cords of the point using the Barnley's formula (which is essentually matrix multiplication)
    const nextX = t.a * x + t.b * y + t.e;
    const nextY = t.c * x + t.d * y + t.f;
    return [nextX, nextY];
}


const barnsleysFern = (context, canvas, iteration_count) => {
    const width = canvas.width;
    const height = canvas.height;

    //fill the canvas with white color
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // draw as many points as asked when calling the function. Only 1 point per frame tho
    let x = 0, y = 0;
    for (let i = 0; i < iteration_count; i++) {
        const draw = () => {
            for (let j = 0; j < 1; j++) {
                [x, y] = nextCords(x, y);
                
                // Map to canvas coordinates
                const canvasX = width / 2 + x * 50;
                const canvasY = height - y * 50;
                
                // Draw point
                context.fillStyle = "green";
                context.fillRect(canvasX, canvasY, 1, 1);
                requestAnimationFrame(draw);
            }
            
        };
        
        draw();

    // add drawing with the mouse
    let isDrawing = false;
    let prevX = null;
    let prevY = null;

    canvas.addEventListener('mousedown', (event) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        prevX = event.clientX - rect.left;
        prevY = event.clientY - rect.top;
    });

    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
        prevX = null;
        prevY = null;
    });

    canvas.addEventListener('mouseleave', () => {
        isDrawing = false;
        prevX = null; 
        prevY = null;
    });
    
    canvas.addEventListener('mousemove', (event) => {
        if (!isDrawing) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        context.beginPath();
        context.moveTo(prevX, prevY);
        context.lineTo(x, y);
        context.strokeStyle = 'black';
        context.lineWidth = 2;
        context.stroke();
        context.closePath();

        prevX = x;
        prevY = y;
    });
    }
}
// info about the numbers is taken from internet (mostly wikipedia)




/* PLEASE nevermind all of that i was just really having fun and looking at what can i do with JS -Amil

const radian = (degree) => {
    return degree * Math.PI / 180;
}

const createPoint = (x, y) => {
    return {
        x: x,
        y: y
    }
}

const randomColor = () => {
    return `hsl(${Math.random() * 360}, 100%, 50%)`;
}

class Ball {
    constructor(x, y, dx, dy, upwards) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.upwards = upwards;
    }
    
    update(canvasHeight) {
        this.y += this.upwards ? -this.dy : this.dy;
        
        if (this.y <= 0) this.upwards = false;
        if (this.y >= canvasHeight) this.upwards = true;
    }
}

linear interpolation function. Used for drawing the linear, quadratic and cubic curves
const lerp = (cord_0, cord_1, t) => {
    return cord_0 + (cord_1 - cord_0) * t;
}

draw a single point (useful for tests and some visuals)
const drawPoint = (x, y) => {
    context.beginPath();
    context.arc(x, y, 1, 0, Math.PI * 2);
    context.fillStyle = colors["black"];
    context.fill();
    context.closePath();
}

const linearCurveShowcase = (context, canvas) => {
    let p0_active = false;
    let p1_active = false;
    let p0 = null;
    let p1 = null;
    
    const drawLine = () => {
        let delta_t = 0.001;
        if (p0_active && p1_active) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            
            context.strokeStyle = colors["black"];
            context.beginPath();
            context.moveTo(p0.x, p0.y);
            for (let t = 0; t <= 1; t += delta_t) {
                let x = lerp(p0.x, p1.x, t);
                let y = lerp(p0.y, p1.y, t);
                drawPoint(x, y);
            }
            context.closePath();
            context.stroke();
        }
    };

    canvas.addEventListener('click', (event) => {
        context.clearRect(0, 0, canvas.width, canvas.height);

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        p0 = createPoint(x, y);
        p0_active = true;

        drawLine();
    })

    canvas.addEventListener('contextmenu', (event) => {
        event.preventDefault()
        context.clearRect(0, 0, canvas.width, canvas.height);

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        p1 = createPoint(x, y);
        p1_active = true;

        drawLine();
    })

    if (p0_active && p1_active) {
        context.strokeStyle = colors["black"];
        context.beginPath();
        context.moveTo(p0.x, p0.y);
        for(let t = 0; t <= 1; t += 0.005) {
            let x = lerp(p0.x, p1.x, t);
            let y = lerp(p0.y, p1.y, t);
            context.moveTo(x, y);
            drawPoint(x, y);
        }
        context.closePath();
        context.stroke();
    }
}

const drawing = (context, canvas) => {
    let isDrawing = false;
    let prevX = null;
    let prevY = null;

    canvas.addEventListener('mousedown', (event) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        prevX = event.clientX - rect.left;
        prevY = event.clientY - rect.top;
    });

    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
        prevX = null;
        prevY = null;
    });

    canvas.addEventListener('mouseleave', () => {
        isDrawing = false;
        prevX = null; 
        prevY = null;
    });
    
    canvas.addEventListener('mousemove', (event) => {
        if (!isDrawing) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        context.beginPath();
        context.moveTo(prevX, prevY);
        context.lineTo(x, y);
        context.strokeStyle = 'black';
        context.lineWidth = 2;
        context.stroke();
        context.closePath();

        prevX = x;
        prevY = y;
    });
};

const quadraticCurveShowcase = (context, canvas) => {
    let p0 = createPoint(canvas.width / 10, canvas.height / 2);
    let p1 = createPoint(canvas.width - canvas.width / 10, canvas.height / 2);
    canvas.addEventListener('mousemove', (event) => {
        context.clearRect(0, 0, canvas.width, canvas.height);

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        context.strokeStyle = colors["black"];
        context.beginPath();
        context.moveTo(p0.x, p0.y);
        context.quadraticCurveTo(x, y, p1.x, p1.y);
        context.closePath();
        context.stroke();
    });
};

const drawCurve = (context, p0, p1, cp1, cp2, cp1_active, cp2_active) => {
    context.strokeStyle = colors["black"];
    context.beginPath();
    context.moveTo(p0.x, p0.y);

    if (cp1_active && cp2_active) {
        context.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, p1.x, p1.y);
    } else if (cp1_active && !cp2_active) {
        context.quadraticCurveTo(cp1.x, cp1.y, p1.x, p1.y);
    } else if (!cp1_active && cp2_active) {
        context.quadraticCurveTo(cp2.x, cp2.y, p1.x, p1.y);
    } else {
        context.lineTo(p1.x, p1.y);
    }

    context.closePath();
    context.stroke();
};

const cubicCurveShowcase = (context, canvas) => {
    let p0 = createPoint(canvas.width / 10, canvas.height / 2);
    let p1 = createPoint(canvas.width - canvas.width / 10, canvas.height / 2);
    let cp1_active = false;
    let cp2_active = false;
    let cp1 = null;
    let cp2 = null;

    canvas.addEventListener('click', (event) => {
        context.clearRect(0, 0, canvas.width, canvas.height);

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        cp1_active = true;
        cp1 = createPoint(x, y);

        drawCurve(context, p0, p1, cp1, cp2, cp1_active, cp2_active);
    });

    canvas.addEventListener('contextmenu', (event) => {
        event.preventDefault();

        context.clearRect(0, 0, canvas.width, canvas.height);

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        cp2_active = true;
        cp2 = createPoint(x, y);

        drawCurve(context, p0, p1, cp1, cp2, cp1_active, cp2_active);
    });
};

const simulationCurve = (context, canvas) => {
    let p0 = createPoint(canvas.width / 10, canvas.height / 2);
    let p1 = createPoint(canvas.width - canvas.width / 10, canvas.height / 2);

    let cp1 = new Ball(canvas.width / 3, canvas.height / 2, 0, 1, false)
    let cp2 = new Ball(canvas.width - canvas.width / 3, canvas.height / 2, 0, 1, true)

    context.strokeStyle = colors["black"];
    const draw = () => {
        context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        context.strokeStyle = `hsl(${cp1.y}, 100%, 50%)`;
        // Update the control points
        cp1.update(canvas.height);
        cp2.update(canvas.height);

        // Draw the cubic bezier curve;
        context.beginPath();
        context.moveTo(p0.x, p0.y); // Move to the start point
        context.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, p1.x, p1.y); // Draw the curve
        context.closePath();
        context.stroke();

        // Call the next frame
        requestAnimationFrame(draw);
    };

    draw();
}

*/