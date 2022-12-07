//button function//
const $ = (s, o = document) => o.querySelector(s);
const $$ = (s, o = document) => o.querySelectorAll(s);

$$('.button').forEach(button => {

    let icon = $('.icon', button),
        line = $('.line', icon),
        svgPath = new Proxy({
            y: null
        }, {
            set(target, key, value) {
                target[key] = value;
                if(target.y !== null) {
                    line.innerHTML = getPath(target.y, .25, null);
                }
                return true;
            },
            get(target, key) {
                return target[key];
            }
        }),
        timeline = gsap.timeline({
            paused: true
        }),
        interval;

    svgPath.y = 12;

    timeline.to(icon, {
        '--arrow-y': 6,
        '--arrow-rotate': 70,
        ease: "elastic.in(1.1, .8)",
        duration: .7
    }).to(icon, {
        '--arrow-y': 0,
        '--arrow-rotate': 45,
        ease: "elastic.out(1.1, .8)",
        duration: .7
    });

    timeline.to(svgPath, {
        y: 15,
        duration: .15
    }, .65).to(svgPath, {
        y: 12,
        ease: "elastic.out(1.2, .7)",
        duration: .6
    }, .8);

    button.addEventListener('mouseover', e => {
        timeline.restart();
        interval = setInterval(() => timeline.restart(), 1500);
    });

    button.addEventListener('mouseout', e => clearInterval(interval));

});

function getPoint(point, i, a, smoothing) {
    let cp = (current, previous, next, reverse) => {
            let p = previous || current,
                n = next || current,
                o = {
                    length: Math.sqrt(Math.pow(n[0] - p[0], 2) + Math.pow(n[1] - p[1], 2)),
                    angle: Math.atan2(n[1] - p[1], n[0] - p[0])
                },
                angle = o.angle + (reverse ? Math.PI : 0),
                length = o.length * smoothing;
            return [current[0] + Math.cos(angle) * length, current[1] + Math.sin(angle) * length];
        },
        cps = cp(a[i - 1], a[i - 2], point, false),
        cpe = cp(point, a[i - 1], a[i + 1], true);
    return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}`;
}

function getPath(update, smoothing, pointsNew) {
    let points = pointsNew ? pointsNew : [
            [5, 12],
            [12, update],
            [19, 12]
        ],
        d = points.reduce((acc, point, i, a) => i === 0 ? `M ${point[0]},${point[1]}` : `${acc} ${getPoint(point, i, a, smoothing)}`, '');
    return `<path d="${d}" />`;
}