/* eslint-env jasmine */
exports.defineAutoTests = function () {
    describe('Native Newton (window.NativeNewton)', function () {
        it('should exist', function () {
            expect(window.NativeNewton).toBeDefined();
        });

        it('window.NativeNewton.attachMasterSession should exist', function () {
            expect(window.NativeNewton.attachMasterSession).toBeDefined();
        });

        it('window.NativeNewton.registerDevice should exist', function () {
            expect(window.NativeNewton.registerDevice).toBeDefined();
        });

        it('window.NativeNewton.setCallback should exist', function () {
            expect(window.NativeNewton.setCallback).toBeDefined();
        });

        it('nativeClassName: Newton', function() {
            expect(window.NativeNewton.nativeClassName).toBeDefined("Newton");
        });
    });
};

exports.defineManualTests = function (contentEl, createActionButton) {
    var logMessage = function (message, color) {
        var log = document.getElementById('info');
        var logLine = document.createElement('div');
        if (color) {
            logLine.style.color = color;
        }
        logLine.innerHTML = message;
        log.appendChild(logLine);
    };

    var clearLog = function () {
        var log = document.getElementById('info');
        log.innerHTML = '';
    };

    var device_tests = '<h3>Press Dump Device button to get device information</h3>' +
        '<div id="dump_device"></div>' +
        'Expected result: Status box will get updated with device info. (i.e. platform, version, uuid, model, etc)';

    contentEl.innerHTML = '<div id="info"></div>' + device_tests;

    createActionButton('Dump device', function () {
        clearLog();
        logMessage(JSON.stringify(window.device, null, '\t'));
    }, 'dump_device');
};