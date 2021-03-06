/*!
 * donutClock.js
 * http://chartjs.org/
 *
 * Copyright 2014 Cam Christou
 * Released under the MIT license
 *
 * Credit to Nick Downie from Chart.js for the basis of significant portions of this code.
 * This application is purpose-built with some customization options available.
 * See Documentation
 */
//Define the global Chart Variable as a class.
window.Chart = function (context) {

    var chart = this;

    //Easing functions adapted from Robert Penner's easing equations
    //http://www.robertpenner.com/easing/

    var animationOptions = {
        linear: function (t) {
            return t;
        },
        easeInCirc: function (t) {
            if (t >= 1) return t;
            return -1 * (Math.sqrt(1 - (t /= 1) * t) - 1);
        },
        easeOutCirc: function (t) {
            return 1 * Math.sqrt(1 - (t = t / 1 - 1) * t);
        },
        easeInOutCirc: function (t) {
            if ((t /= 1 / 2) < 1) return -1 / 2 * (Math.sqrt(1 - t * t) - 1);
            return 1 / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1);
        },
        easeInElastic: function (t) {
            var s = 1.70158;
            var p = 0;
            var a = 1;
            if (t == 0) return 0;
            if ((t /= 1) == 1) return 1;
            if (!p) p = 1 * .3;
            if (a < Math.abs(1)) {
                a = 1;
                var s = p / 4;
            } else var s = p / (2 * Math.PI) * Math.asin(1 / a);
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p));
        },
        easeOutElastic: function (t) {
            var s = 1.70158;
            var p = 0;
            var a = 1;
            if (t == 0) return 0;
            if ((t /= 1) == 1) return 1;
            if (!p) p = 1 * .3;
            if (a < Math.abs(1)) {
                a = 1;
                var s = p / 4;
            } else var s = p / (2 * Math.PI) * Math.asin(1 / a);
            return a * Math.pow(2, -10 * t) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) + 1;
        },
        easeInOutElastic: function (t) {
            var s = 1.70158;
            var p = 0;
            var a = 1;
            if (t == 0) return 0;
            if ((t /= 1 / 2) == 2) return 1;
            if (!p) p = 1 * (.3 * 1.5);
            if (a < Math.abs(1)) {
                a = 1;
                var s = p / 4;
            } else var s = p / (2 * Math.PI) * Math.asin(1 / a);
            if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p));
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) * .5 + 1;
        },
        easeInBack: function (t) {
            var s = 1.70158;
            return 1 * (t /= 1) * t * ((s + 1) * t - s);
        },
        easeOutBack: function (t) {
            var s = 1.70158;
            return 1 * ((t = t / 1 - 1) * t * ((s + 1) * t + s) + 1);
        },
        easeInOutBack: function (t) {
            var s = 1.70158;
            if ((t /= 1 / 2) < 1) return 1 / 2 * (t * t * (((s *= (1.525)) + 1) * t - s));
            return 1 / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2);
        },
        easeInBounce: function (t) {
            return 1 - animationOptions.easeOutBounce(1 - t);
        },
        easeOutBounce: function (t) {
            if ((t /= 1) < (1 / 2.75)) {
                return 1 * (7.5625 * t * t);
            } else if (t < (2 / 2.75)) {
                return 1 * (7.5625 * (t -= (1.5 / 2.75)) * t + .75);
            } else if (t < (2.5 / 2.75)) {
                return 1 * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375);
            } else {
                return 1 * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375);
            }
        },
        easeInOutBounce: function (t) {
            if (t < 1 / 2) return animationOptions.easeInBounce(t * 2) * .5;
            return animationOptions.easeOutBounce(t * 2 - 1) * .5 + 1 * .5;
        }
    };

    //Variables global to the chart
    var width = context.canvas.width;
    var height = context.canvas.height;


    //High pixel density displays - multiply the size of the canvas height/width by the device pixel ratio, then scale.
    if (window.devicePixelRatio) {
        context.canvas.style.width = width + "px";
        context.canvas.style.height = height + "px";
        context.canvas.height = height * window.devicePixelRatio;
        context.canvas.width = width * window.devicePixelRatio;
        context.scale(window.devicePixelRatio, window.devicePixelRatio);
    }




    this.donutClock = function (data, options) {

        chart.donutClock.defaults = {
            mStrokeColor: "#fff",
            hStrokeColor: "#fff",
            segmentStrokeWidth: 2,
            percentageInnerCutout: 50,
            animation: true,
            animationSteps: 100,
            animationEasing: "easeOutBounce",
            animateRotate: true,
            animateScale: false,
            onAnimationComplete: null,
            mcolor: "#F7464A",
            hColor: "#46BFBD",
            sColor: "#FDB45C",
            bgColor: "rgba(255, 255, 0, 0.5)",
            hSep: 3,
            hHeight: 10,
            sSep: 3,
            sHeight: 10
        };

        var config = (options) ? mergeChartConfig(chart.donutClock.defaults, options) : chart.donutClock.defaults;

        return new donutClock(data, config, context);
    };

    var clear = function (c) {
        c.clearRect(0, 0, width, height);
    };


    var donutClock = function (data, config, ctx) {
        var segmentTotal = 0;

        //In case we have a canvas that is not a square. Minus 5 pixels as padding round the edge.
        var donutRadius = Min([height / 2, width / 2]) - 5;

        if (config.outerRadius) {
            donutRadius = Min([donutRadius, config.outerRadius]);
        }

        //make sure data is within allowable ranges
        var cutoutRadius = donutRadius * (config.percentageInnerCutout / 100);
        while (data.seconds > 60) {
            data.seconds -= 60;
            data.minutes++;
        }
        if (data.seconds < 0) {
            data.seconds = 0;
        }
        while (data.minutes > 60) {
            data.minutes -= 60;
            data.hours++;
        }
        if (data.minutes < 0) {
            data.minutes = 0;
        }
        while (data.hours > 12) {
            data.hours -= 12;
        }
        while (data.hours < 1) {
            data.hours = 12;
        }

        minuteSegmentTotal = 60;

        animationLoop(config, null, drawPieSegments, ctx);

        function drawPieSegments(animationDecimal) {
            var noonAngle = -Math.PI / 2;
            var cumulativeAngle = -Math.PI / 2,
                scaleAnimation = 1,
                rotateAnimation = 1;
            if (config.animation) {
                if (config.animateScale) {
                    scaleAnimation = animationDecimal;
                }
                if (config.animateRotate) {
                    rotateAnimation = animationDecimal;
                }
            }

            var minuteSegmentAngle = rotateAnimation * ((data.minutes / 60) * (Math.PI * 2));
            cumulativeAngle = noonAngle;

            //output minutes bar
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, scaleAnimation * donutRadius, cumulativeAngle, cumulativeAngle + minuteSegmentAngle, false);
            ctx.arc(width / 2, height / 2, scaleAnimation * cutoutRadius, cumulativeAngle + minuteSegmentAngle, cumulativeAngle, true);
            ctx.closePath();
            ctx.fillStyle = config.mcolor;
            ctx.fill();
            ctx.lineWidth = config.segmentStrokeWidth;
            ctx.strokeStyle = config.mStrokeColor;
            ctx.stroke();
            cumulativeAngle += minuteSegmentAngle;

            minuteSegmentAngle = (((60 - data.minutes) / 60) * (Math.PI * 2));
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, scaleAnimation * donutRadius, cumulativeAngle, cumulativeAngle + minuteSegmentAngle, false);
            ctx.arc(width / 2, height / 2, scaleAnimation * cutoutRadius, cumulativeAngle + minuteSegmentAngle, cumulativeAngle, true);
            ctx.closePath();
            ctx.fillStyle = config.bgColor;
            ctx.fill();
            ctx.lineWidth = config.segmentStrokeWidth;
            ctx.strokeStyle = config.mStrokeColor;
            ctx.stroke();
            cumulativeAngle += minuteSegmentAngle;

            //output hour blocks
            var hourSegmentAngle = rotateAnimation * ((1 / 12) * (Math.PI * 2));
            cumulativeAngle = noonAngle;
            for (var h = 0; h < data.hours; h++) {
                ctx.beginPath();
                ctx.arc(width / 2, height / 2, scaleAnimation * donutRadius + config.hSep + config.hHeight, cumulativeAngle, cumulativeAngle + hourSegmentAngle, false);
                ctx.arc(width / 2, height / 2, scaleAnimation * donutRadius + config.hSep, cumulativeAngle + hourSegmentAngle, cumulativeAngle, true);
                ctx.closePath();
                ctx.fillStyle = config.hColor;
                ctx.fill();
                ctx.lineWidth = config.segmentStrokeWidth;
                ctx.strokeStyle = config.hStrokeColor;
                ctx.stroke();
                cumulativeAngle += hourSegmentAngle;
            }

            //output seconds bar
            var secondSegmentAngle = rotateAnimation * ((data.seconds / 60) * (Math.PI * 2));
            cumulativeAngle = noonAngle;
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, scaleAnimation * cutoutRadius - config.sSep - config.sHeight, cumulativeAngle, cumulativeAngle + secondSegmentAngle, false);
            ctx.arc(width / 2, height / 2, scaleAnimation * cutoutRadius - config.sSep, cumulativeAngle + secondSegmentAngle, cumulativeAngle, true);
            ctx.closePath();
            ctx.fillStyle = config.sColor;
            ctx.fill();
        }
    }

    function calculateOffset(val, calculatedScale, scaleHop) {
        var outerValue = calculatedScale.steps * calculatedScale.stepValue;
        var adjustedValue = val - calculatedScale.graphMin;
        var scalingFactor = CapValue(adjustedValue / outerValue, 1, 0);
        return (scaleHop * calculatedScale.steps) * scalingFactor;
    }

    function animationLoop(config, drawScale, drawData, ctx) {
        var animFrameAmount = (config.animation) ? 1 / CapValue(config.animationSteps, Number.MAX_VALUE, 1) : 1,
            easingFunction = animationOptions[config.animationEasing],
            percentAnimComplete = (config.animation) ? 0 : 1;

        if (typeof drawScale !== "function") drawScale = function () {};

        requestAnimFrame(animLoop);

        function animateFrame() {
            var easeAdjustedAnimationPercent = (config.animation) ? CapValue(easingFunction(percentAnimComplete), null, 0) : 1;
            clear(ctx);
            if (config.scaleOverlay) {
                drawData(easeAdjustedAnimationPercent);
                drawScale();
            } else {
                drawScale();
                drawData(easeAdjustedAnimationPercent);
            }
        }

        function animLoop() {
            //We need to check if the animation is incomplete (less than 1), or complete (1).
            percentAnimComplete += animFrameAmount;
            animateFrame();
            //Stop the loop continuing forever
            if (percentAnimComplete <= 1) {
                requestAnimFrame(animLoop);
            } else {
                if (typeof config.onAnimationComplete == "function") config.onAnimationComplete();
            }
        }
    }

    //Declare global functions to be called within this namespace here.

    // shim layer with setTimeout fallback
    var requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    function calculateScale(drawingHeight, maxSteps, minSteps, maxValue, minValue, labelTemplateString) {
        var graphMin, graphMax, graphRange, stepValue, numberOfSteps, valueRange, rangeOrderOfMagnitude, decimalNum;

        valueRange = maxValue - minValue;
        rangeOrderOfMagnitude = calculateOrderOfMagnitude(valueRange);
        graphMin = Math.floor(minValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude);
        graphMax = Math.ceil(maxValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude);
        graphRange = graphMax - graphMin;
        stepValue = Math.pow(10, rangeOrderOfMagnitude);
        numberOfSteps = Math.round(graphRange / stepValue);

        //Compare number of steps to the max and min for that size graph, and add in half steps if need be.
        while (numberOfSteps < minSteps || numberOfSteps > maxSteps) {
            if (numberOfSteps < minSteps) {
                stepValue /= 2;
                numberOfSteps = Math.round(graphRange / stepValue);
            } else {
                stepValue *= 2;
                numberOfSteps = Math.round(graphRange / stepValue);
            }
        };

        var labels = [];
        populateLabels(labelTemplateString, labels, numberOfSteps, graphMin, stepValue);

        return {
            steps: numberOfSteps,
            stepValue: stepValue,
            graphMin: graphMin,
            labels: labels
        }

        function calculateOrderOfMagnitude(val) {
            return Math.floor(Math.log(val) / Math.LN10);
        }
    }

    //Max value from array
    function Max(array) {
        return Math.max.apply(Math, array);
    };
    //Min value from array
    function Min(array) {
        return Math.min.apply(Math, array);
    };
    //Default if undefined
    function Default(userDeclared, valueIfFalse) {
        if (!userDeclared) {
            return valueIfFalse;
        } else {
            return userDeclared;
        }
    };
    //Is a number function
    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    //Apply cap a value at a high or low number
    function CapValue(valueToCap, maxValue, minValue) {
        if (isNumber(maxValue)) {
            if (valueToCap > maxValue) {
                return maxValue;
            }
        }
        if (isNumber(minValue)) {
            if (valueToCap < minValue) {
                return minValue;
            }
        }
        return valueToCap;
    }

    function getDecimalPlaces(num) {
        var numberOfDecimalPlaces;
        if (num % 1 != 0) {
            return num.toString().split(".")[1].length
        } else {
            return 0;
        }
    }

    function mergeChartConfig(defaults, userDefined) {
        var returnObj = {};
        for (var attrname in defaults) {
            returnObj[attrname] = defaults[attrname];
        }
        for (var attrname in userDefined) {
            returnObj[attrname] = userDefined[attrname];
        }
        return returnObj;
    }

    //Javascript micro templating by John Resig - source at http://ejohn.org/blog/javascript-micro-templating/
    var cache = {};

    function tmpl(str, data) {
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn = !/\W/.test(str) ?
            cache[str] = cache[str] ||
            tmpl(document.getElementById(str).innerHTML) :

            // Generate a reusable function that will serve as a template
            // generator (and which will be cached).
            new Function("obj",
                "var p=[],print=function(){p.push.apply(p,arguments);};" +

                // Introduce the data as local variables using with(){}
                "with(obj){p.push('" +

                // Convert the template into pure JavaScript
                str
                .replace(/[\r\t\n]/g, " ")
                .split("<%").join("\t")
                .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                .replace(/\t=(.*?)%>/g, "',$1,'")
                .split("\t").join("');")
                .split("%>").join("p.push('")
                .split("\r").join("\\'") + "');}return p.join('');");

        // Provide some basic currying to the user
        return data ? fn(data) : fn;
    };
}