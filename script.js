// Wavy text animation
export const WaviTxt = (color = '#AE236E') => {
    document.addEventListener("DOMContentLoaded", () => {
        const body = document.body;
        const content = document.querySelector('.content');
        const h2Elements = document.querySelectorAll('.content h2');

        // Apply initial styles to the body
        Object.assign(body.style, {
            margin: 0,
            padding: 0,
            boxSizing: 'border-box',
            fontFamily: "'Poppins', sans-serif",
            background: '#000', // Assuming the background is still needed
        });

        // Apply initial styles to the content div
        Object.assign(content.style, {
            position: 'relative',
        });

        // Apply styles to both h2 elements
        h2Elements.forEach(h2 => {
            Object.assign(h2.style, {
                color: '#fff',
                fontSize: '8em',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            });
        });

        // Additional styles for the first h2
        Object.assign(h2Elements[0].style, {
            color: 'transparent',
            WebkitTextStroke: '2px #ffffff',
        });

        // Additional styles for the second h2
        Object.assign(h2Elements[1].style, {
            color: color,
        });

        // Animation logic
        const animatedText = h2Elements[1];
        let startTime;

        const clipPath1 = [
            [0, 45], [16, 44], [33, 50], [54, 60],
            [70, 61], [84, 59], [100, 52], [100, 100], [0, 100]
        ];

        const clipPath2 = [
            [0, 60], [15, 65], [34, 66], [51, 62],
            [67, 50], [84, 45], [100, 46], [100, 100], [0, 100]
        ];

        const interpolate = (start, end, factor) => {
            return start.map((point, index) => {
                const [sx, sy] = point;
                const [ex, ey] = end[index];
                const x = sx + factor * (ex - sx);
                const y = sy + factor * (ey - sy);
                return [x, y];
            });
        };

        const formatClipPath = values => {
            return `polygon(${values.map(point => `${point[0]}% ${point[1]}%`).join(', ')})`;
        };

        const animate = timestamp => {
            if (!startTime) startTime = timestamp;
            const progress = (timestamp - startTime) / 4000; // 4 seconds cycle

            const factor = Math.abs(Math.sin(progress * Math.PI)); // Creates a smooth back-and-forth transition

            const interpolatedValues = interpolate(clipPath1, clipPath2, factor);
            animatedText.style.clipPath = formatClipPath(interpolatedValues);

            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    });
};

// Example usage: Initialize with any "Color" of choice
//WaviTxt('turquoise');


//---------------------------------------------------------------------//


// Thunder text animation
export function SparkiTxt(textContent, initialX, initialY) {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const w = canvas.width = window.innerWidth;
    const h = canvas.height = window.innerHeight;
  
    const thunder = [];
    const particles = [];
  
    class Thunder {
        constructor(options) {
            options = options || {};
            this.lifespan = options.lifespan || Math.round(Math.random() * 10 + 10);
            this.maxlife = this.lifespan;
            this.color = options.color || "#fefefe";
            this.glow = options.glow || "#2323fe";
            this.x = options.x || Math.random() * w;
            this.y = options.y || Math.random() * h;
            this.width = options.width || 2;
            this.direct = options.direct || Math.random() * Math.PI * 2;
            this.max = options.max || Math.round(Math.random() * 10 + 20);
            this.segments = [...new Array(this.max)].map(() => {
                return {
                    direct: this.direct + (Math.PI * Math.random() * 0.2 - 0.1),
                    length: Math.random() * 20 + 80,
                    change: Math.random() * 0.04 - 0.02,
                };
            });
        }
  
        update(index, array) {
            this.segments.forEach((s) => {
                (s.direct += s.change) && Math.random() > 0.96 && (s.change *= -1);
            });
            (this.lifespan > 0 && this.lifespan--) || this.remove(index, array);
        }
  
        render() {
            if (this.lifespan <= 0) return;
            ctx.beginPath();
            ctx.globalAlpha = this.lifespan / this.maxlife;
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.width;
            ctx.shadowBlur = 32;
            ctx.shadowColor = this.glow;
            ctx.moveTo(this.x, this.y);
            let prev = { x: this.x, y: this.y };
            this.segments.forEach((s) => {
                const x = prev.x + Math.cos(s.direct) * s.length;
                const y = prev.y + Math.sin(s.direct) * s.length;
                prev = { x: x, y: y };
                ctx.lineTo(x, y);
            });
            ctx.stroke();
            ctx.closePath();
            ctx.shadowBlur = 0;
            const strength = Math.random() * 80 + 40;
            const light = ctx.createRadialGradient(
                this.x,
                this.y,
                0,
                this.x,
                this.y,
                strength
            );
            light.addColorStop(0, "rgba(250, 200, 50, 0.6)");
            light.addColorStop(0.1, "rgba(250, 200, 50, 0.2)");
            light.addColorStop(0.4, "rgba(250, 200, 50, 0.06)");
            light.addColorStop(0.65, "rgba(250, 200, 50, 0.01)");
            light.addColorStop(0.8, "rgba(250, 200, 50, 0)");
            ctx.beginPath();
            ctx.fillStyle = light;
            ctx.arc(this.x, this.y, strength, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
        }
  
        remove(index, array) {
            array.splice(index, 1);
        }
    }
  
    class Particles {
        constructor(options) {
            options = options || {};
            this.max = options.max || Math.round(Math.random() * 10 + 10);
            this.sparks = [...new Array(this.max)].map(() => new Spark(options));
        }
  
        update() {
            this.sparks.forEach((s, i) => s.update(i, this.sparks));
        }
  
        render() {
            this.sparks.forEach((s) => s.render());
        }
    }
  
    class Spark {
        constructor(options) {
            options = options || {};
            this.x = options.x || w * 0.5;
            this.y = options.y || h * 0.5;
            this.v = options.v || {
                direct: Math.random() * Math.PI * 2,
                weight: Math.random() * 14 + 2,
                friction: 0.88,
            };
            this.a = options.a || {
                change: Math.random() * 0.4 - 0.2,
                min: this.v.direct - Math.PI * 0.4,
                max: this.v.direct + Math.PI * 0.4,
            };
            this.g = options.g || {
                direct: Math.PI * 0.5 + (Math.random() * 0.4 - 0.2),
                weight: Math.random() * 10.25 + 10.25,
            };
            this.width = options.width || Math.random() * 3;
            this.lifespan = options.lifespan || Math.round(Math.random() * 20 + 40);
            this.maxlife = this.lifespan;
            this.color = options.color || "#feca32";
            this.prev = { x: this.x, y: this.y };
        }
  
        update(index, array) {
            this.prev = { x: this.x, y: this.y };
            this.x += Math.cos(this.v.direct) * this.v.weight;
            this.x += Math.cos(this.g.direct) * this.g.weight;
            this.y += Math.sin(this.v.direct) * this.v.weight;
            this.y += Math.sin(this.g.direct) * this.g.weight;
            this.v.weight > 0.2 && (this.v.weight *= this.v.friction);
            this.v.direct += this.a.change;
            (this.v.direct > this.a.max || this.v.direct < this.a.min) &&
                (this.a.change *= -1);
            this.lifespan > 0 && this.lifespan--;
  
            this.lifespan <= 0 && this.remove(index, array);
        }
  
        render() {
            if (this.lifespan <= 0) return;
            ctx.beginPath();
            ctx.globalAlpha = this.lifespan / this.maxlife;
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.width;
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.prev.x, this.prev.y);
            ctx.stroke();
            ctx.closePath();
        }
  
        remove(index, array) {
            array.splice(index, 1);
        }
    }
  
    function animate() {
        requestAnimationFrame(animate);
        update();
        render();
    }
  
    function update() {
        text.update();
        thunder.forEach((l, i) => l.update(i, thunder));
        particles.forEach((p) => p.update());
    }
  
    function render() {
        ctx.clearRect(0, 0, w, h);
        text.render();
        thunder.forEach((l) => l.render());
        particles.forEach((p) => p.render());
    }
  
    class Text {
        constructor(textContent, x, y, fontSize = 48, color = "yellow") {
            const pool = document.createElement("canvas");
            const buffer = pool.getContext("2d");
            const boundingRect = { width: 400, height: 100 }; // Adjust as needed
  
            pool.width = boundingRect.width;
            pool.height = boundingRect.height;
  
            this.size = fontSize;
            this.copy = textContent + " ";
            this.color = color;
            this.delay = 1;
            this.basedelay = this.delay;
            buffer.font = `${this.size}px Comic Sans MS`;
            this.bound = buffer.measureText(this.copy);
            this.bound.height = this.size * 1.5;
            this.x = x || (w - this.bound.width) / 2;
            this.y = y || (h - this.bound.height) / 2 + this.size; // Adjusted for better vertical alignment
  
            buffer.strokeStyle = this.color;
            buffer.strokeText(this.copy, 0, this.bound.height * 0.8);
            this.data = buffer.getImageData(0, 0, this.bound.width, this.bound.height);
            this.index = 0;
        }
  
        update() {
            if (this.index >= this.bound.width) {
                this.index = 0;
                return;
            }
            const data = this.data.data;
            for (let i = this.index * 4; i < data.length; i += 4 * this.data.width) {
                const bitmap = data[i] + data[i + 1] + data[i + 2] + data[i + 3];
                if (bitmap > 255 && Math.random() > 0.96) {
                    const x = this.x + this.index;
                    const y = this.y + i / this.bound.width / 4;
                    thunder.push(new Thunder({ x, y }));
                    Math.random() > 0.5 && particles.push(new Particles({ x, y }));
                }
            }
            if (this.delay-- < 0) {
                this.index++;
                this.delay += this.basedelay;
            }
        }
  
        render() {
            ctx.putImageData(
                this.data,
                this.x,
                this.y,
                0,
                0,
                this.index,
                this.bound.height
            );
        }
  
        setPosition(x, y) {
            this.x = x;
            this.y = y;
        }
    }
  
    const text = new Text(textContent, initialX, initialY);
  
    animate();
  
    return text;
}
  
// Example: Update position dynamically (e.g., on click or over time)
window.addEventListener('click', (event) => {
    textAnimation.setPosition(event.clientX, event.clientY);
});
  
// Example usage: Initialize with any "Text",Position on X axis,Position on Y axis 
//SparkiTxt("Textico", 0, 0);
  

//---------------------------------------------------------------------//


// Typing animation
export function TypoTxt(textArray) {
    var iSpeed = 58; // time delay of print out
    var iIndex = 0; // start printing array at this position
    var iArrLength = textArray[0].length; // the length of the text array
    var iScrollAt = 5; // start scrolling up at this many lines

    var iTextPos = 0; // initialise text position
    var sContents = ""; // initialise contents variable
    var iRow; // initialise current row

    function typewriter() {
        sContents = " ";
        iRow = Math.max(0, iIndex - iScrollAt);
        var destination = document.getElementById("typo");

        while (iRow < iIndex) {
            sContents += textArray[iRow++] + "<br />";
        }
        destination.innerHTML =
            sContents + textArray[iIndex].substring(0, iTextPos) + "_";
        if (iTextPos++ == iArrLength) {
            iTextPos = 0;
            iIndex++;
            if (iIndex == textArray.length) {
                iIndex = 0; // Reset index to loop back to the beginning
            }
            iArrLength = textArray[iIndex].length;
            setTimeout(typewriter, 500);
        } else {
            setTimeout(typewriter, iSpeed);
        }
    }

    typewriter();
}

// Enter the text of your choice for the typo animation
var textArray = new Array(
    "जय हनुमान ज्ञान गुन सागर। जय कपीस तिहुं लोक उजागर।।",
    "राम दूत अतुलित बल धामा। अंजनि-पुत्र पवनसुत नामा।।",
    "महाबीर बिक्रम बजरंगी। कुमति निवार सुमति के संगी।।",
    "कंचन बरन बिराज सुबेसा। कानन कुण्डल कुँचित केसा।।",
    "हाथ बज्र औ ध्वजा बिराजे। कांधे मूंज जनेउ साजे।।",
    "शंकर सुवन केसरी नंदन। तेज प्रताप महा जग वंदन।।",
    "बिद्यावान गुनी अति चातुर। राम काज करिबे को आतुर।।",
    "प्रभु चरित्र सुनिबे को रसिया। राम लखन सीता मन बसिया।।",
    "सूक्ष्म रूप धरि सियहिं दिखावा। बिकट रूप धरि लंक जरावा।।",
    "भीम रूप धरि असुर संहारे। रामचन्द्र के काज संवारे।।",
    "लाय सजीवन लखन जियाये। श्री रघुबीर हरषि उर लाये।।",
    "रघुपति कीन्ही बहुत बड़ाई। तुम मम प्रिय भरतहि सम भाई।।",
    "सहस बदन तुम्हरो जस गावैं। अस कहि श्रीपति कण्ठ लगावैं।।",
    "सनकादिक ब्रह्मादि मुनीसा। नारद सारद सहित अहीसा।।",
    "जम कुबेर दिगपाल जहां ते। कबि कोबिद कहि सके कहां ते।।",
    "                           ",
    "तुम उपकार सुग्रीवहिं कीन्हा। राम मिलाय राज पद दीन्हा।।",
    "तुम्हरो मंत्र बिभीषन माना। लंकेश्वर भए सब जग जाना।।",
    "जुग सहस्र जोजन पर भानु। लील्यो ताहि मधुर फल जानू।।",
    "प्रभु मुद्रिका मेलि मुख माहीं। जलधि लांघि गये अचरज नाहीं।।",
    "दुर्गम काज जगत के जेते। सुगम अनुग्रह तुम्हरे तेते।।"
);

// Example usage: Initialize with any 'String ~ Array like above
//TypoTxt(textArray);


//---------------------------------------------------------------------//


// 3D Folding Animation on Hover
export function FoldiTxt(color) {
    // Construct CSS styles with the provided color value
    const cssStyles = `
        p {
            color: #fff;
            font-family: Avenir Next, Helvetica Neue, Helvetica, Tahoma, sans-serif;
            font-size: 1em;
            font-weight: 700;
            word-spacing: 0px;
            letter-spacing: -25px;
        }
        p span {
            display: inline-block;
            position: relative;
            transform-style: preserve-3d;
            perspective: 500;
            -webkit-font-smoothing: antialiased;
        }
        p span::before,
        p span::after {
            display: none;
            position: absolute;
            top: 0;
            left: -1px;
            transform-origin: left top;
            transition: all ease-out 0.3s;
            content: attr(data-text);
        }
        p span::before {
            z-index: 1;
            color: rgba(0, 0, 0, 0.2);
            transform: scale(1.1, 1) skew(0deg, 20deg);
        }
        p span::after {
            z-index: 2;
            color: ${color}; /* Use the provided color value here */
            text-shadow: -1px 0 1px #684da3, 1px 0 1px rgba(0, 0, 0, 0.8);
            transform: rotateY(-40deg);
        }
        p span:hover::before {
            transform: scale(1.1, 1) skew(0deg, 5deg);
        }
        p span:hover::after {
            transform: rotateY(-10deg);
        }
        p span + span {
            margin-left: 0.3em;
        }
        @media (min-width: 20em) {
            p {
                font-size: 2em;
            }
            p span::before,
            p span::after {
                display: block;
            }
        }
        @media (min-width: 30em) {
            p {
                font-size: 3em;
            }
        }
        @media (min-width: 40em) {
            p {
                font-size: 5em;
            }
        }
        @media (min-width: 60em) {
            p {
                font-size: 8em;
            }
        }
        body {
            background-color: #000000;
        }
    `;

    // Create a <style> element
    const styleElement = document.createElement('style');
    styleElement.textContent = cssStyles;

    // Append the <style> element to the document's <head>
    document.head.appendChild(styleElement);
}

// Example usage: Call the function with a 'Color' value
//FoldiTxt('Red');


//---------------------------------------------------------------------//


// 3D Dynamic Dance Text Animation on Click
export function SymphoniTxt(textColor) {
    const css = `
        @import url("https://fonts.googleapis.com/css?family=Anton|Roboto");

        .word {
          font-family: "Anton", sans-serif;
          perspective: 1000px;
          font-weight: 900;
          text-shadow: 0 0 10px rgb(221, 13, 20);
          display: flex;
          flex-direction: row;
        }

        .word span {
          cursor: pointer;
          display: inline-block;
          font-size: 80px;
          user-select: none;
          line-height: 0.8;
        }
    `;

    // Create a style element and append it to the head
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    const spans = document.querySelectorAll(".word span");

    // Function to create unique keyframes
    const createKeyframes = (name, keyframes) => {
        const styleSheet = document.styleSheets[0];
        const keyframesString = `
            @keyframes ${name} {
                ${keyframes}
            }
        `;
        styleSheet.insertRule(keyframesString, styleSheet.cssRules.length);
    };

    spans.forEach((span, idx) => {
        const animationName = `animation${idx}`;
        let keyframes;

        // Define unique keyframes for each span
        switch (idx % 5) {
            case 0:
                keyframes = `
                    0%, 100% { transform: rotate(0deg); }
                    30%, 60% { transform: rotate(-45deg); }
                `;
                break;
            case 1:
                keyframes = `
                    10%, 35% { transform: scale(2, 0.2) translate(0, 0); }
                    45%, 50% { transform: scale(1) translate(0, -150px); }
                    80% { transform: scale(1) translate(0, 0); }
                `;
                break;
            case 2:
                keyframes = `
                    12% { transform: rotateX(240deg); }
                    24% { transform: rotateX(150deg); }
                    36% { transform: rotateX(200deg); }
                    48% { transform: rotateX(175deg); }
                    60%, 85% { transform: rotateX(180deg); }
                    100% { transform: rotateX(0deg); }
                `;
                break;
            case 3:
                keyframes = `
                    20%, 80% { transform: rotateY(180deg); }
                    100% { transform: rotateY(360deg); }
                `;
                break;
            case 4:
                keyframes = `
                    10%, 40% { transform: translateY(-48vh) scaleY(1); }
                    90% { transform: translateY(-48vh) scaleY(4); }
                `;
                break;
        }

        createKeyframes(animationName, keyframes);

        span.addEventListener("click", (e) => {
            e.target.classList.add("active");
            e.target.style.animation = `${animationName} 1.5s ease-out`;
        });
        span.addEventListener("animationend", (e) => {
            e.target.classList.remove("active");
            e.target.style.animation = "";
        });

        // Initial animation
        setTimeout(() => {
            span.classList.add("active");
            span.style.animation = `${animationName} 1.5s ease-out`;
        }, 750 * (idx + 1));
    });

    // Apply the text color
    document.querySelector('.word').style.color = textColor;
}

// Example usage: Call the function with a 'Color' value 
//SymphoniTxt("white");


//---------------------------------------------------------------------//


// Next Effect Animation
export function NeonTxt(neonColor) {
    const style = document.createElement('style');
    style.textContent = `
        .neon h1 {
            position: relative;
            color: #fff;
            font-size: 50px;
            font-family: "Poppins", cursive;
            text-shadow: 
                0 0 5px ${neonColor},
                0 0 10px ${neonColor},
                0 0 20px ${neonColor},
                0 0 40px ${neonColor},
                0 0 80px ${neonColor};
            animation: ne 3s ease-in-out infinite;
        }
        @keyframes ne {
            50% {
                text-shadow: 
                    0 0 35px blue,
                    0 0 50px ${neonColor},
                    0 0 20px ${neonColor},
                    0 0 40px ${neonColor},
                    0 0 80px ${neonColor};
            }
        }
    `;
    document.head.appendChild(style);
}

// Call the function with the desired neon color
//NeonTxt("red");


//---------------------------------------------------------------------//


