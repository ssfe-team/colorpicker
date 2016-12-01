function Color(color) {
    this.rgb = [];
    this.hex = [];
    this.hsl = [];

    let match = null;

    if (/^\D*(\d{1,3})[^°\d]+(\d{1,3})[^%\d]+(\d{1,3})\D*$/.test(color)) {
        for (let i = 0; i < 3; i++) {
            this.rgb[i] = RegExp['$' + (i + 1)] - 0;
            if (this.rgb[i] > 255) {
                this.rgb = [];
                break;
            }
        }
    } else if (match = /^\s*#?([0-9a-f]{3}([0-9a-f]{3})?)\s*$/i.exec(color)) {

        let hex = match[1],
            len = hex.length / 3,
            index;

        for (let i = 0; i < hex.length; i += len) {

            let block = hex.substr(i, len);

            if (len == 1) {
                block += block;   
            }

            index = i / len;
            this.hex[index] = block;
            this.rgb[index] = parseInt(block, 16);
        }
    } else if (/^\D*(\d+)\D+(\d+(\.\d+)?)%\D+(\d+(\.\d+)?)%\D*$/.test(color)) {

        let H = RegExp.$1 - 0,
            S = RegExp.$2 - 0,
            L = RegExp.$4 - 0;

        if (H <= 360 && S <= 100 && L <= 100) {

            this.hsl = [H, S, L];

            H /= 360,
            S /= 100,
            L /= 100;

            if (S == 0) {
                let r = g = b = Math.ceil(L * 255);
                this.rgb = [r, g, b];
            } else {
                let t2 = L >= 0.5 ? L + S - L * S : L * (1 + S);
                let t1 = 2 * L - t2;
                let tempRGB = [1 / 3, 0, -1 / 3];
                for (let i = 0; i < 3; i++) {
                    let t = H + tempRGB[i];
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (6 * t < 1) {
                        t = t1 + (t2 - t1) * 6 * t;
                    } else if (2 * t < 1) {
                        t = t2;
                    } else if (3 * t < 2) {
                        t = t1 + (t2 - t1) * (2 / 3 - t) * 6;
                    } else {
                        t = t1;
                    }
                    tempRGB[i] = Math.ceil(t * 255);
                }
                this.rgb = tempRGB;
            }
        }
    }
}

Color.prototype.toString = function (style) {

    let str = '';

    if (style) {
        style = style.toLowerCase();   
    }

    switch (style) {

        case 'hex':
            if (this.hex.length != 3 && this.rgb.length == 3) {
                for (let i = 0; i < this.rgb.length; i++) {
                    let ch = this.rgb[i].toString(16);
                    if (ch.length == 1) ch = '0' + ch;
                    this.hex[i] = ch;
                }
            }
            if (this.hex.length == 3) str = '#' + this.hex[0] + this.hex[1] + this.hex[2];
            break;

        case 'hsl':
            if (this.hsl.length != 3 && this.rgb.length == 3) {
                let H, S, L;
                let r = this.rgb[0] / 255,
                    g = this.rgb[1] / 255,
                    b = this.rgb[2] / 255;
                let max = Math.max(r, g, b);
                let min = Math.min(r, g, b);
                L = (max + min) / 2;
                let diff = max - min;
                S = diff == 0 ? 0 : diff / (1 - Math.abs(2 * L - 1));

                if (S == 0) {
                    H = 0;
                } else if (r == max) {
                    H = (g - b) / diff % 6;
                } else if (g == max) {
                    H = (b - r) / diff + 2;
                } else {
                    H = (r - g) / diff + 4;
                }

                H *= 60;
                if (H < 0) H += 360;
                this.hsl = [Math.round(H), (S * 100).toFixed(1), (L * 100).toFixed(1)];
            }
            if (this.hsl.length == 3) {
                str = 'hsl(' + this.hsl[0] + '°, ' + this.hsl[1] + '%, ' + this.hsl[2] + '%)';
            }
            break;

        case 'rgb':

        default:
            if (this.rgb.length == 3) {
                str = 'rgb(' + this.rgb[0] + ', ' + this.rgb[1] + ', ' + this.rgb[2] + ')';
            }
            break;
    }

    return str;
}

function convertColor(id) {
    let str = $('#' + id).val();
    let color = new Color(str);
    let html = '';
    let rgb = color.toString('rgb');

    // if (rgb) {
    //     html = '<span style="border:1px solid #000;background-color:' + rgb + ';">&nbsp;&nbsp;</span><br>';
    //     html += rgb + '<br>hex: ' + color.toString('hex') + '<br>' + color.toString('hsl');
    // } else {
    //     html = '不合法的颜色标识符';
    // }

    // $("#color").html(html);
}