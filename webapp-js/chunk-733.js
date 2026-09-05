"use strict";
(self.webpackChunknokiawifi = self.webpackChunknokiawifi || []).push([
    [733], {
        733: (G, D, h) => {
            h.r(D), h.d(D, {
                MaintenanceModule: () => ct
            });
            var O = h(950),
                L = h(9054),
                r = h(4151),
                I = h(529),
                e = h(8256),
                m = h(731),
                E = h(5650),
                l = h(3584),
                V = h(4474),
                C = h(8922),
                f = h(6895);
            let y = (() => {
                class i {
                    transform(t, s) {
                        if (t) switch (s) {
                            case r.q4.LC:
                                return t.toLowerCase();
                            case r.q4.UC:
                                return t.toUpperCase();
                            case r.q4.SC:
                                return t.trim().charAt(0).toUpperCase() + t.trim().slice(1)
                        }
                    }
                }
                return i.\u0275fac = function(t) {
                    return new(t || i)
                }, i.\u0275pipe = e.Yjl({
                    name: "textTransform",
                    type: i,
                    pure: !0
                }), i
            })();

            function U(i, n) {
                if (1 & i) {
                    const t = e.EpF();
                    e.TgZ(0, "pv-upload", 8), e.NdJ("change", function(a) {
                        e.CHM(t);
                        const o = e.oxw();
                        return e.KtG(o.onFileChange(a))
                    }), e.qZA()
                }
                if (2 & i) {
                    const t = e.oxw();
                    e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "firmwareUpgrade", "selectFile").isDisabled || t.upgradeStarted)("title", t.constants.SELECT_FILE_FIRMWARE)("selectButtonText", t.constants.SELECT)("fileTextNoFile", t.constants.NO_FILE_SELECTED)("fileTextWithFile", t.constants.A_FILE_IS_SELECTED)("isRefresh", t.isRefresh)
                }
            }
            const Z = function(i, n) {
                return {
                    "upgrade-firmware__onsuccess": i,
                    "upgrade-firmware__onerror": n
                }
            };

            function J(i, n) {
                if (1 & i && (e._UZ(0, "pv-text", 9), e.ALo(1, "textTransform")), 2 & i) {
                    const t = e.oxw();
                    e.Q6J("ngClass", e.WLB(5, Z, !!t.isSuccess || null, !!t.isError || null))("title", e.xi3(1, 2, t.status, "sentenceCase"))
                }
            }

            function B(i, n) {
                if (1 & i && (e.TgZ(0, "div", 11), e._UZ(1, "pv-text", 12), e.qZA()), 2 & i) {
                    const t = e.oxw().$implicit;
                    e.xp6(1), e.Q6J("title", t)
                }
            }

            function W(i, n) {
                if (1 & i && (e.ynx(0), e.YNc(1, B, 2, 1, "div", 10), e.BQk()), 2 & i) {
                    const t = n.$implicit;
                    e.xp6(1), e.Q6J("ngIf", t)
                }
            }
            let Q = (() => {
                class i {
                    constructor(t, s, a, o, c, p) {
                        this.api = t, this.constants = s, this.message = a, this.logger = o, this.pureViewSnackbarService = c, this.pubSubService = p, this.upgradeStarted = !1, this.uploadStatus = "", this.statusflag = !1, this.isSuccess = !0, this.isError = !1, this.inProgress = !1, this.statusText = "", this.file = null, this.upgradeSuccess = !1, this.showSaveIcon = !1, this.isRefresh = !1, this.upgradeLogs = []
                    }
                    ngOnInit() {
                        this.resetToDefault(), this.pageRefresh()
                    }
                    pageRefresh() {
                        this.pageRefreshSub = this.pubSubService.subscribe(r.Y7.HEADER_REFRESH_CLICKED, t => {
                            this.upgradeStarted || (this.resetToDefault(), this.fileContent = "", this.isRefresh = !0)
                        })
                    }
                    ngDestroy() {
                        this.resetToDefault()
                    }
                    onFileChange(t) {
                        this.isRefresh = !1, this.pureViewSnackbarService.hideMessageSnackbar(), this.resetToDefault();
                        const s = new FileReader;
                        if (t.target.files && t.target.files.length > 0) {
                            const o = t.target.files[0];
                            this.fileName = t.target.files[0].name, this.fileSize = t.target.files[0].size / 1024 / 1024, this.formData = new FormData, this.formData.append("csrf_token", localStorage.getItem("token")), this.formData.append("filename", o);
                            const c = this.fileName.lastIndexOf("."),
                                p = this.fileName.slice(c + 1, this.fileName.length);
                            s.readAsArrayBuffer(o);
                            var a = this.api.isFWADevice ? 200 : 100;
                            if (Math.floor(this.fileSize) > a) return this.fileContent = "", this.status = "File size is too large.. Upload failed", this.uploadStatus = this.constants.NO_FILE_CHOSEN, this.isSuccess = !1, this.isError = !0, !1;
                            if ("txt" === p || "json" === p || "pdf" === p || "cfg" === p || "png" === p) return this.showWarning(this.constants.INVALID_FILE_FORMAT), this.fileContent = "", this.isSuccess = !1, this.isError = !0, !1;
                            s.onload = () => {
                                this.fileContent = s.result
                            }, s.onloadend = () => {
                                2 === s.readyState && (this.uploadStatus = this.fileName, this.status = "Uploading... Done", this.isSuccess = !0, this.isError = !1)
                            }, s.onprogress = _ => {
                                if (_.lengthComputable) {
                                    let g = _.loaded / _.total * 100;
                                    g = Math.floor(g), 1 === s.readyState && (this.status = `Uploading... ${g}%`)
                                }
                            }
                        }
                    }
                    onUpgrade() {
                        if (console.log("Upgrade button clicked !"), this.pureViewSnackbarService.hideMessageSnackbar(), !this.fileContent) return this.showWarning(this.constants.INVALID_FILE_FORMAT), !1;
                        this.resetToDefault();
                        const t = {
                            headers: new I.WM({
                                enctype: "multipart/form-data"
                            }),
                            withCredentials: !0
                        };
                        this.upgradeStarted = !0, this.status = this.constants.MSG_UPGRADING, this.api.request(this, "startFirmwareUpgarde", this.formData, null, t)
                    }
                    resetToDefault(t) {
                        "upgradeDone" == t ? this.status = "Upgrade Done!" : "upgradeFailed" == t ? (this.status = "Upgrade failed!", this.upgradeStarted = !1, this.isSuccess = !1, this.isError = !0) : (this.status = "", this.isSuccess = !0, this.isError = !1, this.upgradeLogs = []), this.upgradeSuccess = !1, this.onUpgradeInterval && clearTimeout(this.onUpgradeInterval), this.startTimeInterval && clearTimeout(this.startTimeInterval), this.timerRunShellInterval && clearTimeout(this.timerRunShellInterval)
                    }
                    startUpgrade() {
                        this.api.request(this, "invokeShellExistCommand", this.pId)
                    }
                    runShellCatCommand() {
                        this.statusflag = !0, this.api.request(this, "invokeShellCatCommand", this.pId)
                    }
                    showWarning(t) {
                        this.message.showMessage({
                            show: !0,
                            title: this.constants.ERROR_LABEL,
                            description: t,
                            buttonText: "Okay"
                        })
                    }
                    ngOnDestroy() {
                        var t;
                        this.pureViewSnackbarService.hideMessageSnackbar(), null === (t = this.pageRefreshSub) || void 0 === t || t.unsubscribe()
                    }
                    onSuccess(t) {
                        const s = t.data;
                        switch (this.logger.info({
                                msg: "Firmware Upgrade - Action: " + t.action + " On Success",
                                devData: t
                            }), t.action) {
                            case r.eX.GET_FIRMWARE_UPGRADE_STATUS:
                                if (0 == +s) return this.upgradeStarted = !1, this.upgradeSuccess = !1, this.timerRunShellInterval ? void clearTimeout(this.timerRunShellInterval) : void 0;
                                this.status = "Upgrade Done!", this.isError = !1, this.isSuccess = !0, this.upgradeSuccess = !0;
                                break;
                            case r.eX.START_FIRMWARE_UPGRADE:
                                this.log = "", 0 === s.result ? (this.pId = s.pid, this.isError = !1, this.isSuccess = !0, this.startUpgrade(), this.onUpgradeInterval = setTimeout(() => {
                                    this.runShellCatCommand()
                                }, 2e3)) : s.msg ? (this.status = s.msg, this.upgradeStarted = !1) : (this.isError = !0, this.isSuccess = !1, this.status = "Upgrade failed!", this.upgradeStarted = !1);
                                break;
                            case r.eX.INVOKE_SHELL_EXIST_COMMAND:
                                s.exist ? (this.status = this.constants.MSG_UPGRADING, this.startTimeInterval = setTimeout(() => {
                                    this.startUpgrade()
                                }, 5e3)) : this.api.request(this, "getfirmwareUpgradeStatus", {
                                    loaderTimeout: this.constants.TIMEOUT_1_MINUTE
                                });
                                break;
                            case r.eX.INVOKE_CAT_COMMAND:
                                if (">" === s.substr(0, 1)) {
                                    if ("" !== s.substr(1)) {
                                        const a = /[\b]+|[\t\v\r\f]+/g;
                                        let o = `${s.substr(1)}`.replace(a, "");
                                        this.log += o, -1 == this.upgradeLogs.indexOf(o) && this.upgradeLogs.push(o), o.indexOf("Rebooting...") > 0 ? this.resetToDefault("upgradeDone") : this.timerRunShellInterval = setTimeout(() => {
                                            this.runShellCatCommand()
                                        }, 500)
                                    }
                                } else if ("<" === s.substr(0, 1) && -1 !== this.log.indexOf("Rebooting...")) return
                        }
                    }
                    onError(t) {
                        this.logger.error({
                            msg: "Firmware Upgrade - On Error",
                            error: t
                        }), t.action === r.eX.START_FIRMWARE_UPGRADE && this.resetToDefault("upgradeFailed")
                    }
                }
                return i.\u0275fac = function(t) {
                    return new(t || i)(e.Y36(m.s), e.Y36(E.gT), e.Y36(l.Lw), e.Y36(V.Y), e.Y36(l.jR), e.Y36(C.o))
                }, i.\u0275cmp = e.Xpm({
                    type: i,
                    selectors: [
                        ["app-firmware-upgrade"]
                    ],
                    decls: 10,
                    vars: 7,
                    consts: [
                        [1, "flex-column", "grid-gap-24", "upgrade-firmware"],
                        [3, "disabled", "title", "selectButtonText", "fileTextNoFile", "fileTextWithFile", "isRefresh", "change", 4, "ngIf"],
                        [1, "flex-row"],
                        ["type", "submit", "buttonType", "submit", "size", "small", "mr-2", "", 3, "showButtonLoader", "isDisabled", "title", "onClick"],
                        ["body1-regular", "", "mb-4", "", 3, "title"],
                        ["pb-2", "", "mb-4", "", 1, "upgrade-firmware__status"],
                        [3, "ngClass", "title", 4, "ngIf"],
                        [4, "ngFor", "ngForOf"],
                        [3, "disabled", "title", "selectButtonText", "fileTextNoFile", "fileTextWithFile", "isRefresh", "change"],
                        [3, "ngClass", "title"],
                        ["mt-3", "", "class", "flex-row", 4, "ngIf"],
                        ["mt-3", "", 1, "flex-row"],
                        [3, "title"]
                    ],
                    template: function(t, s) {
                        1 & t && (e.TgZ(0, "div", 0)(1, "pv-card"), e.YNc(2, U, 1, 6, "pv-upload", 1), e.TgZ(3, "div", 2)(4, "pv-button", 3), e.NdJ("onClick", function() {
                            return s.onUpgrade()
                        }), e.qZA()()(), e.TgZ(5, "pv-card"), e._UZ(6, "pv-text", 4), e.TgZ(7, "div", 5), e.YNc(8, J, 2, 8, "pv-text", 6), e.qZA(), e.YNc(9, W, 2, 1, "ng-container", 7), e.qZA()()), 2 & t && (e.xp6(2), e.Q6J("ngIf", s.api.device_capability.getVal("maintenance", "firmwareUpgrade", "selectFile").isOn), e.xp6(2), e.Q6J("showButtonLoader", s.upgradeStarted)("isDisabled", s.upgradeStarted || s.api.device_capability.getVal("maintenance", "firmwareUpgrade", "upgradeButton").isDisabled)("title", s.constants.UPGRADE), e.xp6(2), e.Q6J("title", s.constants.UPGRADE_STATUS), e.xp6(2), e.Q6J("ngIf", s.status), e.xp6(1), e.Q6J("ngForOf", s.upgradeLogs))
                    },
                    dependencies: [f.mk, f.sg, f.O5, l.J8, l.g4, l.fC, l.ir, y],
                    styles: [".upgrade-firmware[_ngcontent-%COMP%]{font-size:var(--pure-dimension-19);color:var(--pure-color-gray-800)}.upgrade-firmware__status[_ngcontent-%COMP%]{border-bottom:1px solid var(--pure-color-neutral-30)}.upgrade-firmware__onsuccess[_ngcontent-%COMP%]{color:var(--pure-color-primary-60)}.upgrade-firmware__onerror[_ngcontent-%COMP%]{color:var(--pure-color-bad)}"]
                }), i
            })();
            var d = h(4006),
                Y = h(7445),
                x = h(3199),
                N = h(4119),
                P = h(4830);

            function H(i, n) {
                if (1 & i && e._UZ(0, "pv-select-option", 16), 2 & i) {
                    const t = n.$implicit;
                    e.Q6J("label", t.label)("value", t.value)
                }
            }

            function q(i, n) {
                if (1 & i && (e.TgZ(0, "pv-form-field", 11)(1, "label"), e._UZ(2, "pv-text", 12), e.qZA(), e.TgZ(3, "span", 13)(4, "pv-select", 14), e.YNc(5, H, 1, 2, "pv-select-option", 15), e.qZA()()()), 2 & i) {
                    const t = e.oxw();
                    e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "diagnostics", "protocol").isDisabled)("hasBorder", !0)("rowLayout", !0), e.xp6(2), e.Q6J("title", t.constants.PROTOCOL), e.xp6(2), e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "diagnostics", "protocol").isDisabled), e.xp6(1), e.Q6J("ngForOf", t.prolist)
                }
            }

            function X(i, n) {
                if (1 & i && e._UZ(0, "pv-select-option", 16), 2 & i) {
                    const t = n.$implicit;
                    e.Q6J("label", t.n)("value", t)
                }
            }

            function z(i, n) {
                if (1 & i && (e.TgZ(0, "pv-form-field", 11)(1, "label"), e._UZ(2, "pv-text", 12), e.qZA(), e.TgZ(3, "span", 13)(4, "pv-select", 17), e.YNc(5, X, 1, 2, "pv-select-option", 15), e.qZA()()()), 2 & i) {
                    const t = e.oxw();
                    e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "diagnostics", "wanConnectionList").isDisabled)("hasBorder", !0)("rowLayout", !0), e.xp6(2), e.Q6J("title", t.constants.WAN_CONNECT_LIST), e.xp6(2), e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "diagnostics", "wanConnectionList").isDisabled), e.xp6(1), e.Q6J("ngForOf", t.ifaceList)
                }
            }

            function K(i, n) {
                if (1 & i && (e.TgZ(0, "pv-form-field", 11)(1, "label"), e._UZ(2, "pv-text", 12), e.qZA(), e.TgZ(3, "span", 13), e._UZ(4, "pv-inputbox", 18), e.qZA()()), 2 & i) {
                    const t = e.oxw();
                    e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "diagnostics", "ipOrDomainName").isDisabled)("hasBorder", !0)("rowLayout", !0), e.xp6(2), e.Q6J("title", t.constants.IP_DOMAIN_NAME), e.xp6(2), e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "diagnostics", "ipOrDomainName").isDisabled)("isValidated", t.isIpValid)("errorMessage", t.ipErrorM)("hideErrorIcon", !0)
                }
            }

            function $(i, n) {
                if (1 & i) {
                    const t = e.EpF();
                    e.TgZ(0, "pv-form-field", 19)(1, "label"), e._UZ(2, "pv-text", 12), e.qZA(), e.TgZ(3, "pv-toggle", 20), e.NdJ("onCheck", function() {
                        e.CHM(t);
                        const a = e.oxw();
                        return e.KtG(a.enableDisableControls())
                    }), e.qZA()()
                }
                if (2 & i) {
                    const t = e.oxw();
                    e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "diagnostics", "ping").isDisabled)("rowLayout", !0)("hasBorder", !0), e.xp6(2), e.Q6J("title", t.constants.PING), e.xp6(1), e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "diagnostics", "ping").isDisabled)("isChecked", t.ping.value)
                }
            }

            function j(i, n) {
                if (1 & i) {
                    const t = e.EpF();
                    e.TgZ(0, "pv-form-field", 19)(1, "label"), e._UZ(2, "pv-text", 12), e.qZA(), e.TgZ(3, "pv-toggle", 21), e.NdJ("onCheck", function() {
                        e.CHM(t);
                        const a = e.oxw();
                        return e.KtG(a.enableDisableControls())
                    }), e.qZA()()
                }
                if (2 & i) {
                    const t = e.oxw();
                    e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "diagnostics", "traceRoute").isDisabled)("rowLayout", !0)("hasBorder", !0), e.xp6(2), e.Q6J("title", t.constants.TRACEROUTE), e.xp6(1), e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "diagnostics", "traceRoute").isDisabled)("isChecked", t.trace.value)
                }
            }

            function ee(i, n) {
                if (1 & i && (e.TgZ(0, "pv-form-field", 22)(1, "span")(2, "label"), e._UZ(3, "pv-text", 23), e.qZA(), e._UZ(4, "pv-text", 24), e.qZA(), e._UZ(5, "pv-inputbox", 25), e.qZA()), 2 & i) {
                    const t = e.oxw();
                    e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "diagnostics", "pingTryTimes").isDisabled)("hasBorder", !0)("rowLayout", !0), e.xp6(3), e.Q6J("title", t.constants.PING_TRY_TIMES), e.xp6(1), e.Q6J("title", t.constants.ONE_TO_THOUSAND), e.xp6(1), e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "diagnostics", "pingTryTimes").isDisabled)("isValidated", !0)
                }
            }

            function te(i, n) {
                if (1 & i && (e.TgZ(0, "pv-form-field", 22)(1, "span")(2, "label"), e._UZ(3, "pv-text", 23), e.qZA(), e._UZ(4, "pv-text", 24), e.qZA(), e._UZ(5, "pv-inputbox", 26), e.qZA()), 2 & i) {
                    const t = e.oxw();
                    e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "diagnostics", "packetLength").isDisabled)("hasBorder", !0)("rowLayout", !0), e.xp6(3), e.Q6J("title", t.constants.PACKET_LENGTH), e.xp6(1), e.Q6J("title", t.constants.SIXTYFOUR_TO_1500), e.xp6(1), e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "diagnostics", "packetLength").isDisabled)("isValidated", !0)
                }
            }

            function ie(i, n) {
                if (1 & i && (e.TgZ(0, "pv-form-field", 22)(1, "span")(2, "label"), e._UZ(3, "pv-text", 23), e.qZA(), e._UZ(4, "pv-text", 24), e.qZA(), e._UZ(5, "pv-inputbox", 26), e.qZA()), 2 & i) {
                    const t = e.oxw();
                    e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "diagnostics", "packetLength").isDisabled)("hasBorder", !0)("rowLayout", !0), e.xp6(3), e.Q6J("title", t.constants.PACKET_LENGTH), e.xp6(1), e.Q6J("title", t.constants.SEVENTY_TO_32768), e.xp6(1), e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "diagnostics", "packetLength").isDisabled)("isValidated", !0)
                }
            }

            function se(i, n) {
                if (1 & i && (e.TgZ(0, "pv-form-field", 22)(1, "span")(2, "label"), e._UZ(3, "pv-text", 23), e.qZA(), e._UZ(4, "pv-text", 24), e.qZA(), e._UZ(5, "pv-inputbox", 27), e.qZA()), 2 & i) {
                    const t = e.oxw();
                    e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "diagnostics", "maxNoOfTraceHops").isDisabled)("hasBorder", !0)("rowLayout", !0), e.xp6(3), e.Q6J("title", t.constants.MAX_TRACE_HOPS), e.xp6(1), e.Q6J("title", t.constants.ONE_TO_255), e.xp6(1), e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "diagnostics", "maxNoOfTraceHops").isDisabled)("isValidated", !0)
                }
            }

            function ae(i, n) {
                if (1 & i) {
                    const t = e.EpF();
                    e.TgZ(0, "pv-button", 28), e.NdJ("onClick", function() {
                        e.CHM(t);
                        const a = e.oxw();
                        return e.KtG(a.doPing())
                    }), e.qZA()
                }
                if (2 & i) {
                    const t = e.oxw();
                    e.Q6J("title", t.constants.START_TEST)("isDisabled", t.isPingStarted || t.isCFGMode || t.api.device_capability.getVal("maintenance", "diagnostics", "startButton").isDisabled)
                }
            }

            function ne(i, n) {
                if (1 & i) {
                    const t = e.EpF();
                    e.TgZ(0, "pv-button", 29), e.NdJ("onClick", function() {
                        e.CHM(t);
                        const a = e.oxw();
                        return e.KtG(a.cancelPing())
                    }), e.qZA()
                }
                if (2 & i) {
                    const t = e.oxw();
                    e.Q6J("isDisabled", t.isCFGMode || t.api.device_capability.getVal("maintenance", "diagnostics", "cancelButton").isDisabled)("title", t.constants.CANCEL)
                }
            }
            let oe = (() => {
                class i {
                    constructor(t, s, a, o, c, p, _, g) {
                        this.appAccessService = t, this.constants = s, this.api = a, this.gconfig = o, this.message = c, this.validators = p, this.pubSubService = _, this.pureViewSnackbarService = g, this.startTestDisable = !1, this.ipRegEx = "(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})", this.ifaceList = [], this.ifConnsData = [], this.log = "", this.isPingStarted = !1, this.isCFGMode = !1, this.isIpValid = !0, this.isShowPROTOCOL = !1, this.ipErrorM = "", this.isipv4 = !0, this.showSaveIcon = !1, this.isIpv6Support = !1, this.isSupportTR098 = !1, this.prolist = [{
                            label: "IPv4",
                            value: "ipv4"
                        }, {
                            label: "IPv6",
                            value: "ipv6"
                        }], this.hasError = (u, v) => "required" === v ? this.diagnosticsForm.controls[u].hasError(v) && this.diagnosticsForm.controls[u].touched : !this.diagnosticsForm.controls[u].hasError("required") && this.diagnosticsForm.controls[u].hasError(v) && this.diagnosticsForm.controls[u].touched, "" !== this.api.router_info.gwmodel ? this.loadRouterInfo(this.api) : this.api.request(this, "getRouterInfo")
                    }
                    loadRouterInfo(t) {
                        this.isShowPROTOCOL = -1 !== this.gconfig.supportipv6Diagnostics.indexOf(t.type.toString()), this.isCFGMode = -1 === t.brEnable, this.isSupportTR098 = 0 === t.isSupportTR181, this.isCFGMode && this.showWarning("BWDS" === this.api.g_opId ? this.constants.CFG_WARNING_BWDS : this.constants.CFG_WARNING)
                    }
                    ngOnInit() {
                        this.initForm(), this.getDiagnostics(), this.enableDisableControls(), this.proipv.setValue(this.prolist[0].value), this.onChanges(), this.pageRefresh()
                    }
                    pageRefresh() {
                        this.pageRefreshSub = this.pubSubService.subscribe(r.Y7.HEADER_REFRESH_CLICKED, t => {
                            this.getDiagnostics(), this.ping.setValue(!1), this.trace.setValue(!1), this.ipAdress.setValue(""), this.enableDisableControls()
                        })
                    }
                    onChanges() {
                        this.proipv.valueChanges.subscribe(t => {
                            this.changeipvvalue()
                        })
                    }
                    changeipvvalue() {
                        this.api.get_diagnotics_info.lan_ether.length > 0 && this.syncDiagnosticsData(this.api.get_diagnotics_info)
                    }
                    initForm() {
                        this.diagnosticsForm = new d.cw({
                            proipv: new d.NI({
                                value: "ipv4",
                                disabled: this.api.device_capability.getVal("maintenance", "diagnostics", "protocol").isDisabled
                            }),
                            iface: new d.NI({
                                value: "",
                                disabled: this.api.device_capability.getVal("maintenance", "diagnostics", "wanConnectionList").isDisabled
                            }),
                            maxNumber: new d.NI({
                                value: "30",
                                disabled: this.api.device_capability.getVal("maintenance", "diagnostics", "maxNoOfTraceHops").isDisabled
                            }),
                            packetlength: new d.NI({
                                value: "64",
                                disabled: this.api.device_capability.getVal("maintenance", "diagnostics", "packetLength").isDisabled
                            }),
                            pingTimes: new d.NI({
                                value: "4",
                                disabled: this.api.device_capability.getVal("maintenance", "diagnostics", "pingTryTimes").isDisabled
                            }),
                            trace: new d.NI({
                                value: "",
                                disabled: this.api.device_capability.getVal("maintenance", "diagnostics", "traceRoute").isDisabled
                            }),
                            ping: new d.NI({
                                value: "",
                                disabled: this.api.device_capability.getVal("maintenance", "diagnostics", "ping").isDisabled
                            }),
                            ipAdress: new d.NI({
                                value: "",
                                disabled: this.api.device_capability.getVal("maintenance", "diagnostics", "ipOrDomainName").isDisabled
                            })
                        })
                    }
                    getDiagnostics() {
                        this.api.request(this, "getDiagnosticsInfo")
                    }
                    syncDiagnosticsData(t) {
                        this.ifaceList = [], this.ifaceList.push({
                            n: this.constants.LAN_WAN_INTERFACE,
                            x: "",
                            o: ""
                        }), this.ifConnsData = t.if_conns_glb, this.ifConnsData.forEach(s => {
                            "ipv6" == this.proipv.value ? (this.isipv4 = !1, this.packetlength.setValue("72"), s.ipConns.forEach(a => {
                                if ("Connected" == a.X_CT_COM_IPv6ConnStatus && "PPPoE_Bridged" !== a.ConnectionType) {
                                    const o = Math.floor(a._iid / 1e4),
                                        c = Math.floor(a._iid % 1e4 / 100);
                                    "3_TR069_R_VID_2501" === a.Name && (a.Name = "3_TR069_R"), this.ifaceList.push({
                                        n: a.Name,
                                        x: a.X_ASB_COM_IfName,
                                        o: `ip,${o},${c},${a._oid}`
                                    })
                                }
                            }), s.pppConns.forEach(a => {
                                if ("PPPoE_Bridged" !== a.ConnectionType && "Connected" === a.X_CT_COM_IPv6ConnStatus) {
                                    const o = Math.floor(a._iid / 1e4),
                                        c = Math.floor(a._iid % 1e4 / 100);
                                    this.ifaceList.push({
                                        n: a.Name,
                                        x: a.X_ASB_COM_IfName,
                                        o: `pp,${o},${c},${a._oid}`
                                    })
                                }
                            })) : "ipv4" == this.proipv.value && (this.packetlength.setValue("64"), this.isipv4 = !0, s.ipConns.forEach(a => {
                                if ("Connected" == a.ConnectionStatus && "PPPoE_Bridged" !== a.ConnectionType) {
                                    const o = Math.floor(a._iid / 1e4),
                                        c = Math.floor(a._iid % 1e4 / 100);
                                    "3_TR069_R_VID_2501" === a.Name && (a.Name = "3_TR069_R"), this.ifaceList.push({
                                        n: a.Name,
                                        x: a.X_ASB_COM_IfName,
                                        o: `ip,${o},${c},${a._oid}`
                                    })
                                }
                            }), s.pppConns.forEach(a => {
                                if ("PPPoE_Bridged" !== a.ConnectionType && "Connected" === a.ConnectionStatus) {
                                    const o = Math.floor(a._iid / 1e4),
                                        c = Math.floor(a._iid % 1e4 / 100);
                                    this.ifaceList.push({
                                        n: a.Name,
                                        x: a.X_ASB_COM_IfName,
                                        o: `pp,${o},${c},${a._oid}`
                                    })
                                }
                            }))
                        }), this.iface.setValue(this.ifaceList[0]), window.setTimeout(() => {
                            this.iface.setValue(this.ifaceList[0])
                        }, 250)
                    }
                    enableDisableControls() {
                        const t = this.ping.value,
                            s = this.trace.value;
                        t && s ? (this.packetlength.enable(), this.pingTimes.enable(), this.maxNumber.enable()) : t ? (this.packetlength.enable(), this.pingTimes.enable(), this.maxNumber.disable()) : s ? (this.packetlength.enable(), this.pingTimes.disable(), this.maxNumber.enable()) : (this.packetlength.disable(), this.pingTimes.disable(), this.maxNumber.disable())
                    }
                    ngOnDestroy() {
                        var t;
                        this.pureViewSnackbarService.hideMessageSnackbar(), null === (t = this.pageRefreshSub) || void 0 === t || t.unsubscribe(), this.timerInterval && this.timerInterval.unsubscribe()
                    }
                    doPing() {
                        console.log("this.api.g_opId", this.api.g_opId), this.isIpValid = !0, this.ipErrorM = "", this.startTestDisable = !0, this.timerInterval && this.timerInterval.unsubscribe();
                        const t = this.iface.value;
                        let s = 0;
                        for (const g of this.ifConnsData) {
                            for (const u of g.ipConns)
                                if (u.Name === t.n) {
                                    s = u.X_ALU_COM_isFixedWAN;
                                    break
                                } for (const u of g.pppConns)
                                if (u.Name === t.n) {
                                    s = u.X_ALU_COM_isFixedWAN;
                                    break
                                }
                        }
                        if (1 === s) return this.showWarning(this.constants.ERR_FIXED_WAN), !1;
                        const a = this.ipAdress.value;
                        if (!a) return this.isIpValid = !1, this.ipErrorM = this.constants.REQUIRED_FIELD_LABEL, !1;
                        if (console.log("contina"), "ipv4" == this.proipv.value) {
                            if (!this.validators.Ipv4AddressValidation(a) && !this.validators.checkDomain(a)) return this.isIpValid = !1, this.ipErrorM = this.constants.INVALID_IP_DOMAIN_NAME, !1
                        } else {
                            if (!this.checkipv6(a) && !this.checkDomain(a)) return this.isIpValid = !1, this.ipErrorM = this.constants.INVALID_IP_DOMAIN_NAME, !1;
                            if (this.trace.value && this.isV6LocalLinkAddr(a) && !this.iface.value) return this.ipErrorM = this.constants.PLEASE_SELECT_WAN_CONNECT_LIST, !1
                        }
                        const o = this.ping.value,
                            c = this.trace.value;
                        if (!o && !c) return this.showWarning(this.constants.PLEASE_SELECT_PING_OR_TRACE), !1;
                        if (o || c) {
                            if (this.isipv4) {
                                if (!this.checkValidDiagValues(this.packetlength.value, 64, 1500)) return this.showWarning(this.constants.DEFINE_PACKET_SIZE), !1
                            } else if (!this.checkValidDiagValues(this.packetlength.value, 72, 32768)) return this.showWarning(this.constants.DEFINE_PACKET_SIZE), !1;
                            if (o && !this.checkValidDiagValues(this.pingTimes.value, 1, 1e3)) return this.showWarning(this.constants.DEFINE_ECHO_REQUESTS), !1;
                            if (c && !this.checkValidDiagValues(this.maxNumber.value, 1, 255)) return this.showWarning(this.constants.NUM_TRACEROUTE_HOPS), !1
                        }
                        const p = `${o?"ping":""}${o&&c?",":""}${c?"trace":""}`;
                        this.log = "";
                        const _ = `ipversion=${this.proipv.value}&iface=${t.o?t.o:""}&ipaddr=${a}&checkall=${p}&pingcount=${this.pingTimes.value}&packetlength=${this.packetlength.value}&tracehops=${this.maxNumber.value}`;
                        this.isPingStarted = !0, console.log("params", _), this.api.request(this, "setDiagnosticsInfo", _)
                    }
                    runShellCatCommand() {
                        this.api.request(this, "invokeShellCatCommand", this.pId)
                    }
                    syncShellCatCommand(t) {
                        const s = this.ping.value,
                            a = this.trace.value;
                        let o = !1;
                        ">" === t.substr(0, 1) ? (this.log += `${t.substr(1)} \n`, !s && a ? -1 !== this.log.indexOf("traceroute job completed!!") && (o = !0) : -1 !== this.log.indexOf("round-trip") && (o = !0), o && (this.isPingStarted = !1, this.timerInterval && this.timerInterval.unsubscribe())) : (this.isPingStarted = !1, this.timerInterval && this.timerInterval.unsubscribe())
                    }
                    cancelPing() {
                        this.startTestDisable = !1, this.api.request(this, "cancelDiagnosticsInfo")
                    }
                    checkValidDiagValues(t, s, a) {
                        return !(isNaN(+t) || +t !== parseFloat(t) || +t < s || +t > a)
                    }
                    showWarning(t) {
                        this.message.showMessage({
                            show: !0,
                            title: "",
                            width: "400px",
                            description: t,
                            buttonText: this.constants.OKAY_LABEL
                        })
                    }
                    onSuccess(t) {
                        const s = t.data;
                        switch (t.action) {
                            case r.eX.GET_ROUTER_INFO:
                                this.loadRouterInfo(this.api);
                                break;
                            case r.eX.GET_DIAGNOSTICS_INFO:
                                this.syncDiagnosticsData(s);
                                break;
                            case r.eX.INVOKE_CAT_COMMAND:
                                this.syncShellCatCommand(s);
                                break;
                            case r.eX.SET_DIAGNOSTICS_INFO:
                                0 === s.result ? (this.pId = s.pid, this.timerInterval = (0, Y.F)(2e3).subscribe(a => {
                                    this.runShellCatCommand()
                                })) : this.isPingStarted = !1;
                                break;
                            case r.eX.CANCEL_DIAGNOSTICS_INFO:
                                this.isPingStarted = !1, this.timerInterval && this.timerInterval.unsubscribe()
                        }
                    }
                    onError(t) {
                        switch (t.action) {
                            case r.eX.GET_ROUTER_INFO:
                                console.error("GET_ROUTER_INFO API Failed - Error"), console.error(t);
                                break;
                            case r.eX.GET_DIAGNOSTICS_INFO:
                                console.error("GET_DNS_DATA API Failed - Error"), console.error(t);
                                break;
                            case r.eX.INVOKE_CAT_COMMAND:
                                console.error("INVOKE_CAT_COMMAND API Failed - Error"), console.error(t);
                                break;
                            case r.eX.SET_DIAGNOSTICS_INFO:
                                console.error("SET_DIAGNOSTICS_INFO API Failed - Error"), console.error(t);
                                break;
                            case r.eX.CANCEL_DIAGNOSTICS_INFO:
                                console.error("CANCEL_DIAGNOSTICS_INFO API Failed - Error"), console.error(t)
                        }
                    }
                    get proipv() {
                        return this.diagnosticsForm.get("proipv")
                    }
                    get iface() {
                        return this.diagnosticsForm.get("iface")
                    }
                    get maxNumber() {
                        return this.diagnosticsForm.get("maxNumber")
                    }
                    get trace() {
                        return this.diagnosticsForm.get("trace")
                    }
                    get ping() {
                        return this.diagnosticsForm.get("ping")
                    }
                    get pingTimes() {
                        return this.diagnosticsForm.get("pingTimes")
                    }
                    get packetlength() {
                        return this.diagnosticsForm.get("packetlength")
                    }
                    get ipAdress() {
                        return this.diagnosticsForm.get("ipAdress")
                    }
                    checkDomain(t) {
                        return !(t.length > 255) && !!/^(([a-zA-Z0-9]{1,2})|([a-zA-Z0-9]([a-zA-Z0-9-]){1,61}[a-zA-Z0-9]))(\.(([a-zA-Z0-9]{1,2})|([a-zA-Z0-9]([a-zA-Z0-9-]){1,61}[a-zA-Z0-9]))){1,}$/.test(t)
                    }
                    checkipv6(t) {
                        if (null == t.match(/[1-9A-Fa-f]/g) || !t.trim() || -1 != t.indexOf("/")) return !1;
                        var s = t.split("/");
                        if (!/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/.test(s[0])) return !1;
                        const o = s[1];
                        return !o || !!(o.isdd() && parseInt(o) >= 0 && parseInt(o) <= 128)
                    }
                    isV6LocalLinkAddr(t) {
                        const s = t.substring(0, 4),
                            a = parseInt(s, 16);
                        return a >= 65152 && a <= 65215
                    }
                }
                return i.\u0275fac = function(t) {
                    return new(t || i)(e.Y36(x.r), e.Y36(E.gT), e.Y36(m.s), e.Y36(N.O), e.Y36(l.Lw), e.Y36(P.l), e.Y36(C.o), e.Y36(l.jR))
                }, i.\u0275cmp = e.Xpm({
                    type: i,
                    selectors: [
                        ["app-diagnostics"]
                    ],
                    decls: 19,
                    vars: 14,
                    consts: [
                        [3, "formGroup"],
                        ["formRef", ""],
                        ["h2-bold", "", "mb-4", "", 3, "title"],
                        ["pb-4", "", 3, "disabled", "hasBorder", "rowLayout", 4, "ngIf"],
                        ["pb-4", "", 3, "disabled", "rowLayout", "hasBorder", 4, "ngIf"],
                        ["pb-4", "", "labelAlign", "top", 3, "disabled", "hasBorder", "rowLayout", 4, "ngIf"],
                        [1, "flex-row"],
                        ["type", "submit", "buttonType", "submit", "size", "small", "mr-2", "", 3, "title", "isDisabled", "onClick", 4, "ngIf"],
                        ["size", "small", "buttonType", "button", "outline", "primary", 3, "isDisabled", "title", "onClick", 4, "ngIf"],
                        ["mt-4", ""],
                        [3, "ngModel", "ngModelChange"],
                        ["pb-4", "", 3, "disabled", "hasBorder", "rowLayout"],
                        [3, "title"],
                        [1, "diagnostics__form-control"],
                        ["formControlName", "proipv", "size", "MEDIUM", 3, "disabled"],
                        [3, "label", "value", 4, "ngFor", "ngForOf"],
                        [3, "label", "value"],
                        ["formControlName", "iface", "size", "MEDIUM", 3, "disabled"],
                        ["size", "MEDIUM", "formControlName", "ipAdress", 3, "disabled", "isValidated", "errorMessage", "hideErrorIcon"],
                        ["pb-4", "", 3, "disabled", "rowLayout", "hasBorder"],
                        ["formControlName", "ping", 3, "disabled", "isChecked", "onCheck"],
                        ["formControlName", "trace", 3, "disabled", "isChecked", "onCheck"],
                        ["pb-4", "", "labelAlign", "top", 3, "disabled", "hasBorder", "rowLayout"],
                        ["mt-2", "", 3, "title"],
                        ["subtext2-regular-800", "", "mt-4", "", 3, "title"],
                        ["size", "MEDIUM", "formControlName", "pingTimes", 1, "diagnostics__form-control", 3, "disabled", "isValidated"],
                        ["size", "MEDIUM", "formControlName", "packetlength", 1, "diagnostics__form-control", 3, "disabled", "isValidated"],
                        ["size", "MEDIUM", "formControlName", "maxNumber", 1, "diagnostics__form-control", 3, "disabled", "isValidated"],
                        ["type", "submit", "buttonType", "submit", "size", "small", "mr-2", "", 3, "title", "isDisabled", "onClick"],
                        ["size", "small", "buttonType", "button", "outline", "primary", 3, "isDisabled", "title", "onClick"]
                    ],
                    template: function(t, s) {
                        1 & t && (e.TgZ(0, "div")(1, "form", 0, 1)(3, "pv-card"), e._UZ(4, "pv-text", 2), e.YNc(5, q, 6, 6, "pv-form-field", 3), e.YNc(6, z, 6, 6, "pv-form-field", 3), e.YNc(7, K, 5, 8, "pv-form-field", 3), e.YNc(8, $, 4, 6, "pv-form-field", 4), e.YNc(9, j, 4, 6, "pv-form-field", 4), e.YNc(10, ee, 6, 7, "pv-form-field", 5), e.YNc(11, te, 6, 7, "pv-form-field", 5), e.YNc(12, ie, 6, 7, "pv-form-field", 5), e.YNc(13, se, 6, 7, "pv-form-field", 5), e.TgZ(14, "div", 6), e.YNc(15, ae, 1, 2, "pv-button", 7), e.YNc(16, ne, 1, 2, "pv-button", 8), e.qZA()()(), e.TgZ(17, "pv-card", 9)(18, "pv-textarea", 10), e.NdJ("ngModelChange", function(o) {
                            return s.log = o
                        }), e.qZA()()()), 2 & t && (e.xp6(1), e.Q6J("formGroup", s.diagnosticsForm), e.xp6(3), e.Q6J("title", s.constants.WAN_NETWORK), e.xp6(1), e.Q6J("ngIf", s.isShowPROTOCOL && s.api.device_capability.getVal("maintenance", "diagnostics", "protocol").isOn || s.api.device_capability.getVal("maintenance", "diagnostics", "protocol").isOn && s.isSupportTR098), e.xp6(1), e.Q6J("ngIf", s.api.device_capability.getVal("maintenance", "diagnostics", "wanConnectionList").isOn), e.xp6(1), e.Q6J("ngIf", s.api.device_capability.getVal("maintenance", "diagnostics", "ipOrDomainName").isOn), e.xp6(1), e.Q6J("ngIf", s.api.device_capability.getVal("maintenance", "diagnostics", "ping").isOn), e.xp6(1), e.Q6J("ngIf", s.api.device_capability.getVal("maintenance", "diagnostics", "traceRoute").isOn), e.xp6(1), e.Q6J("ngIf", s.api.device_capability.getVal("maintenance", "diagnostics", "pingTryTimes").isOn), e.xp6(1), e.Q6J("ngIf", s.isipv4 && s.api.device_capability.getVal("maintenance", "diagnostics", "packetLength").isOn), e.xp6(1), e.Q6J("ngIf", !s.isipv4 && s.api.device_capability.getVal("maintenance", "diagnostics", "packetLength").isOn), e.xp6(1), e.Q6J("ngIf", s.api.device_capability.getVal("maintenance", "diagnostics", "maxNoOfTraceHops").isOn), e.xp6(2), e.Q6J("ngIf", s.api.device_capability.getVal("maintenance", "diagnostics", "startButton").isOn), e.xp6(1), e.Q6J("ngIf", s.api.device_capability.getVal("maintenance", "diagnostics", "cancelButton").isOn), e.xp6(2), e.Q6J("ngModel", s.log))
                    },
                    dependencies: [f.sg, f.O5, d._Y, d.JJ, d.JL, d.On, l.J8, l.ci, l.g4, l.$t, l.fC, l.tB, l._H, l.ON, l.UG, d.sg, d.u],
                    styles: [".diagnostics__form-control[_ngcontent-%COMP%]{width:300px}"]
                }), i
            })();
            var F = h(4080),
                re = h(9441),
                k = h(7556);

            function le(i, n) {
                if (1 & i && e._UZ(0, "pv-select-option", 11), 2 & i) {
                    const s = n.index;
                    e.Q6J("label", n.$implicit)("value", s)
                }
            }

            function ce(i, n) {
                if (1 & i && (e.TgZ(0, "pv-form-field", 6)(1, "label"), e._UZ(2, "pv-text", 7), e.qZA(), e.TgZ(3, "span", 8)(4, "pv-select", 9), e.YNc(5, le, 1, 2, "pv-select-option", 10), e.qZA()()()), 2 & i) {
                    const t = e.oxw();
                    e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "log", "writingLevel").isDisabled)("hasBorder", !0)("rowLayout", !0), e.xp6(2), e.Q6J("title", t.constants.WRITING_LEVEL), e.xp6(2), e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "log", "writingLevel").isDisabled), e.xp6(1), e.Q6J("ngForOf", t.writingLevelList)
                }
            }

            function de(i, n) {
                if (1 & i && e._UZ(0, "pv-select-option", 11), 2 & i) {
                    const t = n.$implicit;
                    e.Q6J("label", t.label)("value", t.value)
                }
            }

            function pe(i, n) {
                if (1 & i && (e.TgZ(0, "pv-form-field", 6)(1, "label"), e._UZ(2, "pv-text", 7), e.qZA(), e.TgZ(3, "span", 8)(4, "pv-select", 12), e.YNc(5, de, 1, 2, "pv-select-option", 10), e.qZA()()()), 2 & i) {
                    const t = e.oxw();
                    e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "log", "readingLevel").isDisabled)("hasBorder", !0)("rowLayout", !0), e.xp6(2), e.Q6J("title", t.constants.READING_LEVEL), e.xp6(2), e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "log", "readingLevel").isDisabled), e.xp6(1), e.Q6J("ngForOf", t.readingLevelList)
                }
            }

            function he(i, n) {
                if (1 & i && e._UZ(0, "pv-textarea", 13), 2 & i) {
                    const t = e.oxw();
                    e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "log", "logInfo").isDisabled)
                }
            }

            function ue(i, n) {
                if (1 & i) {
                    const t = e.EpF();
                    e.TgZ(0, "pv-button", 17), e.NdJ("onClick", function() {
                        e.CHM(t);
                        const a = e.oxw(2);
                        return e.KtG(a.submitForm())
                    }), e.qZA()
                }
                if (2 & i) {
                    const t = e.oxw(2);
                    e.Q6J("isDisabled", t.isCFGMode || t.api.device_capability.getVal("maintenance", "log", "saveButton").isDisabled)("title", t.constants.SAVE)("webSave", t.showSaveIcon)("showButtonLoader", t.disableSave)
                }
            }

            function _e(i, n) {
                if (1 & i) {
                    const t = e.EpF();
                    e.TgZ(0, "pv-button", 18), e.NdJ("click", function() {
                        e.CHM(t);
                        const a = e.oxw(2);
                        return e.KtG(a.onExport())
                    }), e.qZA()
                }
                if (2 & i) {
                    const t = e.oxw(2);
                    e.Q6J("isDisabled", t.isCFGMode || t.api.device_capability.getVal("maintenance", "log", "exportLog").isDisabled)("title", t.constants.EXPORT_LOG)
                }
            }

            function ge(i, n) {
                if (1 & i && (e.ynx(0), e.TgZ(1, "div", 14), e.YNc(2, ue, 1, 4, "pv-button", 15), e.qZA(), e.TgZ(3, "div", 14), e.YNc(4, _e, 1, 2, "pv-button", 16), e.qZA(), e.BQk()), 2 & i) {
                    const t = e.oxw();
                    e.xp6(2), e.Q6J("ngIf", t.api.device_capability.getVal("maintenance", "log", "saveButton").isOn), e.xp6(2), e.Q6J("ngIf", t.api.device_capability.getVal("maintenance", "log", "exportLog").isOn)
                }
            }
            let fe = (() => {
                class i {
                    constructor(t, s, a, o, c, p, _, g, u, v) {
                        this.portalService = t, this.appAccessService = s, this.constants = a, this.api = o, this.gconfig = c, this.message = p, this.validations = _, this.auth = g, this.pubSubService = u, this.pureViewSnackbarService = v, this.writingLevelList = [this.constants.LOG_EMERGENCY, this.constants.LOG_ALERT, this.constants.LOG_CRITICAL, this.constants.ERROR_LABEL, this.constants.WARNING, this.constants.LOG_NOTICE, this.constants.LOG_INFORMATIONAL, this.constants.LOG_DEBUG], this.isCFGMode = !1, this.readingLevelList = [{
                            label: this.constants.LOG_EMERGENCY,
                            value: "Emergency"
                        }, {
                            label: this.constants.LOG_ALERT,
                            value: "Alert"
                        }, {
                            label: this.constants.LOG_CRITICAL,
                            value: "Critical"
                        }, {
                            label: this.constants.ERROR_LABEL,
                            value: "Error"
                        }, {
                            label: this.constants.WARNING,
                            value: "Warning"
                        }, {
                            label: this.constants.LOG_NOTICE,
                            value: "Notice"
                        }, {
                            label: this.constants.LOG_INFORMATIONAL,
                            value: "Informational"
                        }, {
                            label: this.constants.LOG_DEBUG,
                            value: "Debug"
                        }], this.exportText = "", this.showSaveIcon = !1, this.disableSave = !1, this.logForm = new d.cw({
                            writingLevel: new d.NI({
                                value: "",
                                disabled: this.api.device_capability.getVal("maintenance", "log", "writingLevel").isDisabled
                            }),
                            readingLevel: new d.NI({
                                value: "",
                                disabled: this.api.device_capability.getVal("maintenance", "log", "readingLevel").isDisabled
                            }),
                            logWrite: new d.NI({
                                value: "",
                                disabled: this.api.device_capability.getVal("maintenance", "log", "logInfo").isDisabled
                            })
                        }), "" !== this.api.router_info.gwmodel ? this.loadRouterInfo(this.api) : this.api.request(this, "getRouterInfo")
                    }
                    loadRouterInfo(t) {
                        this.isCFGMode = -1 === t.brEnable, this.isCFGMode && ("BWDS" === this.api.g_opId ? window.alert(this.constants.CFG_WARNING_BWDS) : window.alert(this.constants.CFG_WARNING))
                    }
                    ngOnInit() {
                        0 !== this.api.get_log_info.syslog_cfg.length && (this.syncLogsData(this.api.get_log_info), this.logWrite.setValue(this.validations.logs)), this.getLogsInfo(), this.portalService.passPortal(this.portalContent), setTimeout(() => {
                            this.portalService.passPortal(this.portalContent), this.setValueOnLangChange()
                        }, 1e3), this.refreshPage(), this.onLanguageChanges()
                    }
                    onLanguageChanges() {
                        this.langChangeSub = this.pubSubService.subscribe(r.Y7.LANGUAGE_CHANGE, t => {
                            this.setValueOnLangChange()
                        })
                    }
                    setValueOnLangChange() {
                        this.writingLevelList = [this.constants.LOG_EMERGENCY, this.constants.LOG_ALERT, this.constants.LOG_CRITICAL, this.constants.ERROR_LABEL, this.constants.WARNING, this.constants.LOG_NOTICE, this.constants.LOG_INFORMATIONAL, this.constants.LOG_DEBUG], this.readingLevelList = [{
                            label: this.constants.LOG_EMERGENCY,
                            value: "Emergency"
                        }, {
                            label: this.constants.LOG_ALERT,
                            value: "Alert"
                        }, {
                            label: this.constants.LOG_CRITICAL,
                            value: "Critical"
                        }, {
                            label: this.constants.ERROR_LABEL,
                            value: "Error"
                        }, {
                            label: this.constants.WARNING,
                            value: "Warning"
                        }, {
                            label: this.constants.LOG_NOTICE,
                            value: "Notice"
                        }, {
                            label: this.constants.LOG_INFORMATIONAL,
                            value: "Informational"
                        }, {
                            label: this.constants.LOG_DEBUG,
                            value: "Debug"
                        }], this.getLogsInfo()
                    }
                    refreshPage() {
                        this.pageRefreshSub = this.pubSubService.subscribe(r.Y7.HEADER_REFRESH_CLICKED, t => {
                            this.getLogsInfo()
                        })
                    }
                    getLogsInfo() {
                        this.api.request(this, "getLogsInfo")
                    }
                    syncLogsData(t) {
                        this.writingLevel.setValue(this.api.isFWADevice ? this.findLogLevel(t) : t.ct_syslog_cfg.Level), this.readingLevel.setValue(t.syslog_cfg.LocalDisplayLevel), this.api.request(this, "getLog")
                    }
                    findLogLevel(t) {
                        for (var s = 0; s < this.writingLevelList.length; s++)
                            if (t.vendor_log_cfg.X_ALU_COM_LogSeverity === this.writingLevelList[s]) return s
                    }
                    ngOnDestroy() {
                        var t, s;
                        this.pureViewSnackbarService.hideMessageSnackbar(), null === (t = this.pageRefreshSub) || void 0 === t || t.unsubscribe(), this.langChangeSub.unsubscribe(), null !== (s = this.portalContent) && void 0 !== s && s.isAttached && this.portalContent.detach()
                    }
                    submitForm() {
                        this.pureViewSnackbarService.hideMessageSnackbar(), this.disableSave = !0;
                        const t = `logLevel=${this.writingLevel.value}&logDispLevel=${this.readingLevel.value}`;
                        console.log(t), this.api.request(this, "setlog", t)
                    }
                    onExport() {
                        this.pureViewSnackbarService.hideMessageSnackbar(), this.createAndDownloadBlobFile(this.validations.logs, {
                            type: "text/plain;charset=utf-8"
                        }, "onu_info.log")
                    }
                    createAndDownloadBlobFile(t, s, a) {
                        const o = new Blob([t], s);
                        if (navigator.msSaveBlob) navigator.msSaveBlob(o, a), this.exportText = "Success";
                        else {
                            const c = document.createElement("a");
                            if (void 0 !== c.download) {
                                const p = URL.createObjectURL(o);
                                c.setAttribute("href", p), c.setAttribute("download", a), c.style.visibility = "hidden", document.body.appendChild(c), c.click(), document.body.removeChild(c), this.exportText = "Success"
                            }
                        }
                    }
                    onSuccess(t) {
                        const s = t.data;
                        switch (t.action) {
                            case r.eX.GET_ROUTER_INFO:
                                this.loadRouterInfo(this.api);
                                break;
                            case r.eX.GET_LOG_INFO:
                                this.syncLogsData(s);
                                break;
                            case r.eX.GET_LOG:
                                this.logWrite.setValue(s), this.validations.logs = this.logWrite.value;
                                break;
                            case r.eX.SET_LOG:
                                this.disableSave = !1, this.getLogsInfo(), this.showSaveIcon = !0, window.setTimeout(() => {
                                    this.showSaveIcon = !1
                                }, 1e3)
                        }
                    }
                    onError(t) {
                        switch (t.action) {
                            case r.eX.GET_ROUTER_INFO:
                                console.error("GET_ROUTER_INFO API Failed - Error"), console.error(t);
                                break;
                            case r.eX.GET_LOG_INFO:
                                console.error("GET_LOG_INFO API Failed - Error"), console.error(t);
                                break;
                            case r.eX.GET_LOG:
                                console.error("GET_LOG API Failed - Error"), console.error(t);
                                break;
                            case r.eX.SET_LOG:
                                this.disableSave = !1, console.error("SET_LOG API Failed - Error"), console.error(t);
                                break;
                            case r.eX.DEL_DEVICE_MANAGEMENT_INFO:
                                console.error("DEL_DEVICE_MANAGEMENT_INFO API Failed - Error"), console.error(t)
                        }
                    }
                    get writingLevel() {
                        return this.logForm.get("writingLevel")
                    }
                    get readingLevel() {
                        return this.logForm.get("readingLevel")
                    }
                    get logWrite() {
                        return this.logForm.get("logWrite")
                    }
                }
                return i.\u0275fac = function(t) {
                    return new(t || i)(e.Y36(re.E), e.Y36(x.r), e.Y36(E.gT), e.Y36(m.s), e.Y36(N.O), e.Y36(l.Lw), e.Y36(P.l), e.Y36(k.e), e.Y36(C.o), e.Y36(l.jR))
                }, i.\u0275cmp = e.Xpm({
                    type: i,
                    selectors: [
                        ["app-log"]
                    ],
                    viewQuery: function(t, s) {
                        if (1 & t && e.Gf(F.ig, 7), 2 & t) {
                            let a;
                            e.iGM(a = e.CRH()) && (s.portalContent = a.first)
                        }
                    },
                    decls: 9,
                    vars: 4,
                    consts: [
                        [3, "formGroup"],
                        ["formRef", ""],
                        ["mb-4", ""],
                        ["pb-4", "", 3, "disabled", "hasBorder", "rowLayout", 4, "ngIf"],
                        ["formControlName", "logWrite", 3, "disabled", 4, "ngIf"],
                        [4, "cdkPortal"],
                        ["pb-4", "", 3, "disabled", "hasBorder", "rowLayout"],
                        [3, "title"],
                        [1, "log__form-control"],
                        ["formControlName", "writingLevel", "size", "MEDIUM", 3, "disabled"],
                        [3, "label", "value", 4, "ngFor", "ngForOf"],
                        [3, "label", "value"],
                        ["formControlName", "readingLevel", "size", "MEDIUM", 3, "disabled"],
                        ["formControlName", "logWrite", 3, "disabled"],
                        [1, "flex-row", "flex-row__center"],
                        ["buttonType", "submit", "size", "small", "mr-2", "", 3, "isDisabled", "title", "webSave", "showButtonLoader", "onClick", 4, "ngIf"],
                        ["outline", "primary", "size", "small", "type", "button", 3, "isDisabled", "title", "click", 4, "ngIf"],
                        ["buttonType", "submit", "size", "small", "mr-2", "", 3, "isDisabled", "title", "webSave", "showButtonLoader", "onClick"],
                        ["outline", "primary", "size", "small", "type", "button", 3, "isDisabled", "title", "click"]
                    ],
                    template: function(t, s) {
                        1 & t && (e.TgZ(0, "div")(1, "form", 0, 1)(3, "pv-card", 2), e.YNc(4, ce, 6, 6, "pv-form-field", 3), e.YNc(5, pe, 6, 6, "pv-form-field", 3), e.qZA(), e.TgZ(6, "pv-card"), e.YNc(7, he, 1, 1, "pv-textarea", 4), e.qZA(), e.YNc(8, ge, 5, 2, "ng-container", 5), e.qZA()()), 2 & t && (e.xp6(1), e.Q6J("formGroup", s.logForm), e.xp6(3), e.Q6J("ngIf", s.api.device_capability.getVal("maintenance", "log", "writingLevel").isOn), e.xp6(1), e.Q6J("ngIf", s.api.device_capability.getVal("maintenance", "log", "readingLevel").isOn), e.xp6(2), e.Q6J("ngIf", s.api.device_capability.getVal("maintenance", "log", "logInfo").isOn))
                    },
                    dependencies: [f.sg, f.O5, d._Y, d.JJ, d.JL, l.J8, l.g4, l.fC, l.tB, l._H, l.ON, l.UG, d.sg, d.u, F.ig],
                    styles: [".log__form-control[_ngcontent-%COMP%]{width:300px}"]
                }), i
            })();

            function me(i, n) {
                if (1 & i) {
                    const t = e.EpF();
                    e.TgZ(0, "pv-upload", 4), e.NdJ("change", function(a) {
                        e.CHM(t);
                        const o = e.oxw();
                        return e.KtG(o.onFileChange(a))
                    }), e.qZA()
                }
                if (2 & i) {
                    const t = e.oxw();
                    e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "backupAndRestore", "selectFile").isDisabled)("title", t.constants.SELECT_FILE)("selectButtonText", t.constants.SELECT)("fileTextNoFile", t.constants.NO_FILE_SELECTED)("fileTextWithFile", t.constants.A_FILE_IS_SELECTED)("isRefresh", t.isRefresh)
                }
            }

            function ve(i, n) {
                if (1 & i) {
                    const t = e.EpF();
                    e.TgZ(0, "pv-button", 8), e.NdJ("click", function() {
                        e.CHM(t);
                        const a = e.oxw(2);
                        return e.KtG(a.onImport())
                    }), e.qZA()
                }
                if (2 & i) {
                    const t = e.oxw(2);
                    e.Q6J("isDisabled", t.restoreStarted || t.isCFGMode || t.api.device_capability.getVal("maintenance", "backupAndRestore", "importButton").isDisabled)("title", t.constants.IMPORT)
                }
            }

            function be(i, n) {
                if (1 & i && (e.TgZ(0, "pv-form-field", 5)(1, "label"), e._UZ(2, "pv-text", 6), e.qZA(), e.YNc(3, ve, 1, 2, "pv-button", 7), e.qZA()), 2 & i) {
                    const t = e.oxw();
                    e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "backupAndRestore", "importConfigFile").isDisabled)("hasBorder", !0)("rowLayout", !0), e.xp6(2), e.Q6J("title", t.constants.IMPORT_CONFIG_FILE), e.xp6(1), e.Q6J("ngIf", t.api.device_capability.getVal("maintenance", "backupAndRestore", "importButton").isOn)
                }
            }

            function we(i, n) {
                if (1 & i) {
                    const t = e.EpF();
                    e.TgZ(0, "pv-button", 8), e.NdJ("click", function() {
                        e.CHM(t);
                        const a = e.oxw(2);
                        return e.KtG(a.onExport())
                    }), e.qZA()
                }
                if (2 & i) {
                    const t = e.oxw(2);
                    e.Q6J("isDisabled", t.isCFGMode || t.api.device_capability.getVal("maintenance", "backupAndRestore", "exportButton").isDisabled)("title", t.constants.EXPORT)
                }
            }

            function Ee(i, n) {
                if (1 & i && (e.TgZ(0, "pv-form-field", 5)(1, "label"), e._UZ(2, "pv-text", 6), e.qZA(), e.YNc(3, we, 1, 2, "pv-button", 7), e.qZA()), 2 & i) {
                    const t = e.oxw();
                    e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "backupAndRestore", "exportConfigFile").isDisabled)("hasBorder", !0)("rowLayout", !0), e.xp6(2), e.Q6J("title", t.constants.EXPORT_CONFIG_FILE), e.xp6(1), e.Q6J("ngIf", t.api.device_capability.getVal("maintenance", "backupAndRestore", "exportButton").isOn)
                }
            }
            const Ce = function(i, n) {
                return {
                    "upgrade-firmware__onsuccess": i,
                    "upgrade-firmware__onerror": n
                }
            };

            function Ie(i, n) {
                if (1 & i && (e.TgZ(0, "pv-card"), e._UZ(1, "pv-text", 9), e.TgZ(2, "div", 10), e._UZ(3, "pv-text", 11), e.ALo(4, "textTransform"), e.qZA()()), 2 & i) {
                    const t = e.oxw();
                    e.xp6(1), e.Q6J("title", t.constants.UPGRADE_STATUS), e.xp6(2), e.Q6J("ngClass", e.WLB(6, Ce, t.isSuccess, t.isError))("title", e.xi3(4, 3, t.fileName, "sentenceCase"))
                }
            }
            let Te = (() => {
                class i {
                    constructor(t, s, a, o, c) {
                        this.api = t, this.constants = s, this.message = a, this.pubSubService = o, this.pureViewSnackbarService = c, this.fileName = "", this.restoreStarted = !1, this.isCFGMode = !1, this.isSuccess = !0, this.isError = !1, this.fileUploaded = !1, this.importText = "", this.exportText = "", this.isRefresh = !1, "" !== this.api.router_info.gwmodel ? this.loadRouterInfo(this.api) : this.api.request(this, "getRouterInfo")
                    }
                    loadRouterInfo(t) {
                        this.isCFGMode = -1 === t.brEnable, this.isCFGMode && ("BWDS" === this.api.g_opId ? window.alert(this.constants.CFG_WARNING_BWDS) : window.alert(this.constants.CFG_WARNING))
                    }
                    ngOnInit() {
                        this.pageRefresh()
                    }
                    pageRefresh() {
                        this.pageRefreshSub = this.pubSubService.subscribe(r.Y7.HEADER_REFRESH_CLICKED, t => {
                            this.importText = "", this.isSuccess = !0, this.isError = !1, this.fileUploaded = !1, this.isRefresh = !0
                        })
                    }
                    ngOnDestroy() {
                        var t;
                        this.pureViewSnackbarService.hideMessageSnackbar(), null === (t = this.pageRefreshSub) || void 0 === t || t.unsubscribe()
                    }
                    onFileChange(t) {
                        this.importText = "", this.isRefresh = !1;
                        const s = new FileReader;
                        if (t.target.files && t.target.files.length > 0) {
                            this.fileUploaded = !0;
                            const a = t.target.files[0];
                            this.fileName = t.target.files[0].name, this.formData = new FormData, this.formData.append("csrf_token", localStorage.getItem("token")), this.formData.append("filename", a);
                            const o = this.fileName.lastIndexOf("."),
                                c = this.fileName.slice(o + 1, this.fileName.length),
                                p = t.target.files[0].size / 1024 / 1024,
                                _ = this.fileName.slice(0, o),
                                g = /^[0-9A-Za-z_]+$/,
                                u = (_.match(/\./g) || []).length;
                            if ("cfg" !== c) return this.fileName = this.constants.INVALID_FILE_FORMAT, this.fileContent = "", this.isSuccess = !1, this.isError = !0, !1;
                            if (Math.floor(p) > 2) return this.fileContent = "", this.fileName = this.constants.FILE_SIZE_TOO_LARGE_UPLOAD_FAILED, this.isSuccess = !1, this.isError = !0, !1;
                            if (!g.test(_) || u > 1) return this.fileName = this.constants.ILLEGAL_FILENAME, this.isSuccess = !1, this.isError = !0, this.fileContent = "", !1;
                            this.isSuccess = !0, this.isError = !1, s.readAsArrayBuffer(a), s.onload = () => {
                                let v = "";
                                const b = new Uint8Array(s.result),
                                    S = b.byteLength;
                                for (let A = 0; A < S; A++) v += String.fromCharCode(b[A]);
                                this.fileContent = v
                            }
                        }
                    }
                    onImport() {
                        return this.fileContent ? (this.restoreStarted = !0, window.confirm(this.constants.CONFIRMATION) ? void this.api.request(this, "importBackupRestore", this.formData) : (this.restoreStarted = !1, !1)) : (window.alert(this.constants.PLEASE_SELECT_FILE), !1)
                    }
                    onExport() {
                        this.exportText = "", this.api.request(this, "exportBackupRestore")
                    }
                    createAndDownloadBlobFile(t, s, a) {
                        const o = new Blob([t], s);
                        if (navigator.msSaveBlob) navigator.msSaveBlob(o, a), this.exportText = "Success";
                        else {
                            const c = document.createElement("a");
                            if (void 0 !== c.download) {
                                const p = URL.createObjectURL(o);
                                c.setAttribute("href", p), c.setAttribute("download", a), c.style.visibility = "hidden", document.body.appendChild(c), c.click(), document.body.removeChild(c), this.exportText = "Success"
                            }
                        }
                    }
                    onSuccess(t) {
                        const s = t.data;
                        switch (t.action) {
                            case r.eX.GET_ROUTER_INFO:
                                this.loadRouterInfo(this.api);
                                break;
                            case r.eX.IMPORT_BACKUP_RESTORE:
                                if (this.status = s.msg, 0 !== s.result) return this.restoreStarted = !1, !1;
                                this.api.request(this, "rebootSystem");
                                break;
                            case r.eX.REBOOT_SYSTEM:
                                this.importText = "Ok", console.log("Backup Restore Page : Reboot Success !");
                                break;
                            case r.eX.EXPORT_BACKUP_RESTORE:
                                this.createAndDownloadBlobFile(s, {
                                    type: "application/octet-stream"
                                }, "config.cfg")
                        }
                    }
                    onError(t) {
                        switch (t.action) {
                            case r.eX.GET_ROUTER_INFO:
                                console.error("GET_ROUTER_INFO API Failed - Error"), console.error(t);
                                break;
                            case r.eX.IMPORT_BACKUP_RESTORE:
                                console.error("IMPORT_BACKUP_RESTORE API Failed - Error"), console.error(t);
                                break;
                            case r.eX.REBOOT_SYSTEM:
                                console.error("REBOOT_SYSTEM API Failed - Error"), console.error(t);
                                break;
                            case r.eX.EXPORT_BACKUP_RESTORE:
                                console.error("EXPORT_BACKUP_RESTORE API Failed - Error"), console.error(t)
                        }
                    }
                }
                return i.\u0275fac = function(t) {
                    return new(t || i)(e.Y36(m.s), e.Y36(E.gT), e.Y36(l.Lw), e.Y36(C.o), e.Y36(l.jR))
                }, i.\u0275cmp = e.Xpm({
                    type: i,
                    selectors: [
                        ["app-backup-restore"]
                    ],
                    decls: 5,
                    vars: 4,
                    consts: [
                        ["mb-6", ""],
                        [3, "disabled", "title", "selectButtonText", "fileTextNoFile", "fileTextWithFile", "isRefresh", "change", 4, "ngIf"],
                        ["pb-4", "", 3, "disabled", "hasBorder", "rowLayout", 4, "ngIf"],
                        [4, "ngIf"],
                        [3, "disabled", "title", "selectButtonText", "fileTextNoFile", "fileTextWithFile", "isRefresh", "change"],
                        ["pb-4", "", 3, "disabled", "hasBorder", "rowLayout"],
                        [3, "title"],
                        ["outline", "primary", "size", "small", "type", "button", 3, "isDisabled", "title", "click", 4, "ngIf"],
                        ["outline", "primary", "size", "small", "type", "button", 3, "isDisabled", "title", "click"],
                        ["body1-regular", "", "mb-4", "", 3, "title"],
                        ["pb-2", "", "mb-4", "", 1, "upgrade-firmware__status"],
                        [3, "ngClass", "title"]
                    ],
                    template: function(t, s) {
                        1 & t && (e.TgZ(0, "pv-card", 0), e.YNc(1, me, 1, 6, "pv-upload", 1), e.YNc(2, be, 4, 5, "pv-form-field", 2), e.YNc(3, Ee, 4, 5, "pv-form-field", 2), e.qZA(), e.YNc(4, Ie, 5, 9, "pv-card", 3)), 2 & t && (e.xp6(1), e.Q6J("ngIf", s.api.device_capability.getVal("maintenance", "backupAndRestore", "selectFile").isOn), e.xp6(1), e.Q6J("ngIf", s.api.device_capability.getVal("maintenance", "backupAndRestore", "importConfigFile").isOn), e.xp6(1), e.Q6J("ngIf", s.api.device_capability.getVal("maintenance", "backupAndRestore", "exportConfigFile").isOn), e.xp6(1), e.Q6J("ngIf", s.fileUploaded))
                    },
                    dependencies: [f.mk, f.O5, l.J8, l.g4, l.fC, l.tB, l.ir, y],
                    styles: [".upgrade-firmware[_ngcontent-%COMP%]{font-size:var(--pure-dimension-19);color:var(--pure-color-gray-800)}.upgrade-firmware__status[_ngcontent-%COMP%]{border-bottom:1px solid var(--pure-color-neutral-30)}.upgrade-firmware__onsuccess[_ngcontent-%COMP%]{color:var(--pure-color-primary-60)}.upgrade-firmware__onerror[_ngcontent-%COMP%]{color:var(--pure-color-bad)}"]
                }), i
            })();

            function Se(i, n) {
                if (1 & i && (e.TgZ(0, "pv-form-field", 7)(1, "label"), e._UZ(2, "pv-text", 8), e.qZA(), e.TgZ(3, "span", 9), e._UZ(4, "pv-inputbox", 10), e.qZA()()), 2 & i) {
                    const t = e.oxw();
                    e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "loidAuthentication", "loid").isDisabled)("hasBorder", !0)("rowLayout", !0), e.xp6(2), e.Q6J("title", t.constants.LOID_LABEL), e.xp6(2), e.Q6J("isValidated", t.loidValid)("errorMessage", t.loidError)("hideErrorIcon", !0)
                }
            }

            function Ae(i, n) {
                if (1 & i) {
                    const t = e.EpF();
                    e.TgZ(0, "pv-form-field", 7)(1, "label"), e._UZ(2, "pv-text", 8), e.qZA(), e.TgZ(3, "span", 9)(4, "pv-inputbox", 11), e.NdJ("onInputFocus", function() {
                        e.CHM(t);
                        const a = e.oxw();
                        return e.KtG(a.onfocusPwd())
                    }), e.qZA()()()
                }
                if (2 & i) {
                    const t = e.oxw();
                    e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "loidAuthentication", "password").isDisabled)("hasBorder", !0)("rowLayout", !0), e.xp6(2), e.Q6J("title", t.constants.PASSWORD_LABEL), e.xp6(2), e.Q6J("isValidated", t.passwordValid)("errorMessage", t.passwordError)("hideErrorIcon", !0)
                }
            }

            function xe(i, n) {
                if (1 & i) {
                    const t = e.EpF();
                    e.TgZ(0, "pv-button", 12), e.NdJ("onClick", function() {
                        e.CHM(t);
                        const a = e.oxw();
                        return e.KtG(a.submitForm())
                    }), e.qZA()
                }
                if (2 & i) {
                    const t = e.oxw();
                    e.Q6J("isDisabled", t.isCFGMode || t.api.device_capability.getVal("maintenance", "loidAuthentication", "saveButton").isDisabled)("webSave", t.showSaveIcon)("showButtonLoader", t.disableSave)("title", t.constants.SAVE)
                }
            }
            let Re = (() => {
                class i {
                    constructor(t, s, a, o, c, p) {
                        this.appAccessService = t, this.constants = s, this.api = a, this.pubSubService = o, this.pureViewSnackbarService = c, this.message = p, this.isCFGMode = !1, this.loidValid = !0, this.passwordValid = !0, this.loidError = "", this.passwordError = "", this.disableSave = !1, this.showSaveIcon = !1, "" !== this.api.router_info.gwmodel ? this.loadRouterInfo(this.api) : this.api.request(this, "getRouterInfo")
                    }
                    loadRouterInfo(t) {
                        this.isCFGMode = -1 === t.brEnable, this.isCFGMode && this.showWarning("BWDS" === this.api.g_opId ? this.constants.CFG_WARNING_BWDS : this.constants.CFG_WARNING)
                    }
                    ngOnInit() {
                        this.csswd = "", this.getLoidConfigInfo(), this.pageRefresh(), this.loidConfigForm = new d.cw({
                            loid: new d.NI({
                                value: "",
                                disabled: this.api.device_capability.getVal("maintenance", "loidAuthentication", "loid").isDisabled
                            }),
                            loidPassword: new d.NI({
                                value: "",
                                disabled: this.api.device_capability.getVal("maintenance", "loidAuthentication", "password").isDisabled
                            })
                        })
                    }
                    pageRefresh() {
                        this.pageRefreshSub = this.pubSubService.subscribe(r.Y7.HEADER_REFRESH_CLICKED, t => {
                            this.getLoidConfigInfo()
                        })
                    }
                    get loid() {
                        return this.loidConfigForm.get("loid")
                    }
                    get loidPassword() {
                        return this.loidConfigForm.get("loidPassword")
                    }
                    getLoidConfigInfo() {
                        this.api.request(this, "getLoidConfig")
                    }
                    ngOnDestroy() {
                        var t;
                        this.pureViewSnackbarService.hideMessageSnackbar(), null === (t = this.pageRefreshSub) || void 0 === t || t.unsubscribe()
                    }
                    submitForm() {
                        this.resetValues(), this.pureViewSnackbarService.hideMessageSnackbar();
                        const t = this.loid.value;
                        let s = this.loidPassword.value;
                        if (!t) return this.loidValid = !1, this.loidError = this.constants.REQUIRED_FIELD_LABEL, !1;
                        if (t.length > 24) return this.loidValid = !1, this.loidError = this.constants.ERR_LOID_LEN, !1;
                        if (s || (s = ""), s.length > 12) return this.passwordValid = !1, this.passwordError = this.constants.ERR_PASS_LEN, !1;
                        if (!this.isvalidStr(t)) return this.loidValid = !1, this.loidError = this.constants.LOID_INVALID_CHAR, !1;
                        const a = `csswd=${this.csswd}&loid=${t}&pswd=${s}`;
                        this.disableSave = !0, this.api.request(this, "setLoidConfig", a)
                    }
                    onfocusPwd() {
                        this.csswd = "1", this.loidPassword.setValue("")
                    }
                    isvalidStr(t) {
                        let s = 0;
                        for (s = 0; s < t.length; s++)
                            if (this.isValidChar(t.charAt(s))) return !1;
                        return !0
                    }
                    isValidChar(t) {
                        return !(-1 === "?-=#\"<>\\^[]`+$,'&@.:\t".indexOf(t) && t.charCodeAt(0) > 36 && t.charCodeAt(0) < 123)
                    }
                    resetValues() {
                        this.passwordValid = !0, this.passwordError = "", this.loidValid = !0, this.loidError = ""
                    }
                    showWarning(t) {
                        this.message.showMessage({
                            show: !0,
                            title: "",
                            width: "400px",
                            description: t,
                            buttonText: this.constants.OKAY_LABEL
                        })
                    }
                    onSuccess(t) {
                        const s = t.data;
                        switch (t.action) {
                            case r.eX.GET_ROUTER_INFO:
                                this.loadRouterInfo(this.api);
                                break;
                            case r.eX.GET_LOID_CONFIG:
                                this.loid.setValue(s.uinfo.UserName), this.loidPassword.setValue(s.uinfo.UserId);
                                break;
                            case r.eX.SET_LOID_CONFIG:
                                this.disableSave = !1, this.getLoidConfigInfo(), this.showSaveIcon = !0, window.setTimeout(() => {
                                    this.showSaveIcon = !1
                                }, 1e3)
                        }
                    }
                    onError(t) {
                        switch (t.action) {
                            case r.eX.GET_ROUTER_INFO:
                                console.error("GET_ROUTER_INFO API Failed - Error"), console.error(t);
                                break;
                            case r.eX.GET_LOID_CONFIG:
                                console.error("GET_LOID_CONFIG API Failed - Error"), console.error(t);
                                break;
                            case r.eX.SET_LOID_CONFIG:
                                this.disableSave = !1, console.error("SET_LOID_CONFIG API Failed - Error"), console.error(t)
                        }
                    }
                }
                return i.\u0275fac = function(t) {
                    return new(t || i)(e.Y36(x.r), e.Y36(E.gT), e.Y36(m.s), e.Y36(C.o), e.Y36(l.jR), e.Y36(l.Lw))
                }, i.\u0275cmp = e.Xpm({
                    type: i,
                    selectors: [
                        ["app-loid"]
                    ],
                    decls: 9,
                    vars: 6,
                    consts: [
                        [3, "formGroup"],
                        ["formRef", ""],
                        ["h2-bold", "", 3, "title"],
                        ["caption1-regular", "", "mb-4", "", 3, "title"],
                        ["pb-4", "", 3, "disabled", "hasBorder", "rowLayout", 4, "ngIf"],
                        [1, "flex-row"],
                        ["type", "submit", "buttonType", "submit", "size", "small", "mr-2", "", 3, "isDisabled", "webSave", "showButtonLoader", "title", "onClick", 4, "ngIf"],
                        ["pb-4", "", 3, "disabled", "hasBorder", "rowLayout"],
                        [3, "title"],
                        [1, "loid__form-control"],
                        ["size", "MEDIUM", "formControlName", "loid", "maxlength", "24", 3, "isValidated", "errorMessage", "hideErrorIcon"],
                        ["size", "MEDIUM", "formControlName", "loidPassword", "type", "password", "maxlength", "12", 3, "isValidated", "errorMessage", "hideErrorIcon", "onInputFocus"],
                        ["type", "submit", "buttonType", "submit", "size", "small", "mr-2", "", 3, "isDisabled", "webSave", "showButtonLoader", "title", "onClick"]
                    ],
                    template: function(t, s) {
                        1 & t && (e.TgZ(0, "pv-card")(1, "form", 0, 1), e._UZ(3, "pv-text", 2)(4, "pv-text", 3), e.YNc(5, Se, 5, 7, "pv-form-field", 4), e.YNc(6, Ae, 5, 7, "pv-form-field", 4), e.TgZ(7, "div", 5), e.YNc(8, xe, 1, 4, "pv-button", 6), e.qZA()()()), 2 & t && (e.xp6(1), e.Q6J("formGroup", s.loidConfigForm), e.xp6(2), e.Q6J("title", s.constants.LOID_AUTH), e.xp6(1), e.Q6J("title", s.constants.LOID_FIELD_LEN_INSTRUCTION), e.xp6(1), e.Q6J("ngIf", s.api.device_capability.getVal("maintenance", "loidAuthentication", "loid").isOn), e.xp6(1), e.Q6J("ngIf", s.api.device_capability.getVal("maintenance", "loidAuthentication", "password").isOn), e.xp6(2), e.Q6J("ngIf", s.api.device_capability.getVal("maintenance", "loidAuthentication", "saveButton").isOn))
                    },
                    dependencies: [f.O5, d._Y, d.JJ, d.JL, d.nD, l.J8, l.ci, l.g4, l.fC, l.tB, d.sg, d.u],
                    styles: [".loid__form-control[_ngcontent-%COMP%]{width:300px}"]
                }), i
            })();

            function De(i, n) {
                if (1 & i && (e.TgZ(0, "pv-form-field", 5)(1, "label"), e._UZ(2, "pv-text", 6), e.qZA(), e._UZ(3, "pv-text", 7), e.qZA()), 2 & i) {
                    const t = e.oxw();
                    e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "slidConfiguration", "currentSlid").isDisabled)("hasBorder", !0)("rowLayout", !0), e.xp6(2), e.Q6J("title", t.constants.CURRENT_SLID), e.xp6(1), e.Q6J("title", t.currentSlid)
                }
            }

            function Oe(i, n) {
                if (1 & i && (e.TgZ(0, "pv-form-field", 5)(1, "label"), e._UZ(2, "pv-text", 6), e.qZA(), e.TgZ(3, "span", 8), e._UZ(4, "pv-inputbox", 9), e.qZA()()), 2 & i) {
                    const t = e.oxw();
                    e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "slidConfiguration", "enterNewSlid").isDisabled)("hasBorder", !0)("rowLayout", !0), e.xp6(2), e.Q6J("title", t.constants.ENTER_NEW_SLID), e.xp6(2), e.Q6J("isValidated", t.slidValid)("errorMessage", t.slidError)("hideErrorIcon", !0)
                }
            }

            function Le(i, n) {
                if (1 & i && e._UZ(0, "pv-text", 13), 2 & i) {
                    const t = e.oxw(2);
                    e.Q6J("title", t.constants.ASCII_MODE_MAX_CHAR)
                }
            }

            function Ne(i, n) {
                if (1 & i && e._UZ(0, "pv-text", 13), 2 & i) {
                    const t = e.oxw(2);
                    e.Q6J("title", t.constants.HEX_MODE_MAX_CHAR)
                }
            }

            function Pe(i, n) {
                if (1 & i && e._UZ(0, "pv-select-option", 14), 2 & i) {
                    const t = n.$implicit;
                    e.Q6J("label", t.label)("value", t.value)
                }
            }

            function Me(i, n) {
                if (1 & i && (e.TgZ(0, "pv-form-field", 5)(1, "label"), e._UZ(2, "pv-text", 6), e.YNc(3, Le, 1, 1, "pv-text", 10), e.YNc(4, Ne, 1, 1, "pv-text", 10), e.qZA(), e.TgZ(5, "span", 8)(6, "pv-select", 11), e.YNc(7, Pe, 1, 2, "pv-select-option", 12), e.qZA()()()), 2 & i) {
                    const t = e.oxw();
                    e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "slidConfiguration", "slidMode").isDisabled)("hasBorder", !0)("rowLayout", !0), e.xp6(2), e.Q6J("title", t.constants.SLID_MODE), e.xp6(1), e.Q6J("ngIf", 1 === t.slidMode.value), e.xp6(1), e.Q6J("ngIf", 0 === t.slidMode.value), e.xp6(3), e.Q6J("ngForOf", t.slidModeList)
                }
            }

            function ye(i, n) {
                if (1 & i) {
                    const t = e.EpF();
                    e.TgZ(0, "pv-button", 15), e.NdJ("onClick", function() {
                        e.CHM(t);
                        const a = e.oxw();
                        return e.KtG(a.saveSlidConfig())
                    }), e.qZA()
                }
                if (2 & i) {
                    const t = e.oxw();
                    e.Q6J("isDisabled", t.isCFGMode || t.api.device_capability.getVal("maintenance", "slidConfiguration", "saveButton").isDisabled)("webSave", t.showSaveIcon)("showButtonLoader", t.disableSave)("title", t.constants.SAVE)
                }
            }
            let Fe = (() => {
                class i {
                    get newSlid() {
                        return this.slidConfigForm.get("newSlid")
                    }
                    get slidMode() {
                        return this.slidConfigForm.get("slidMode")
                    }
                    constructor(t, s, a, o, c, p) {
                        this.appAccessService = t, this.constants = s, this.api = a, this.pureViewSnackbarService = o, this.message = c, this.pubSubService = p, this.slidValid = !0, this.slidError = "", this.disableSave = !1, this.showSaveIcon = !1, this.isCFGMode = !1, this.slidModeList = [{
                            label: this.constants.ASCII_MODE,
                            value: 1
                        }, {
                            label: this.constants.HEX_MODE,
                            value: 0
                        }], "" !== this.api.router_info.gwmodel ? this.loadRouterInfo(this.api) : this.api.request(this, "getRouterInfo")
                    }
                    loadRouterInfo(t) {
                        this.isCFGMode = -1 === t.brEnable, this.isCFGMode && this.showWarning("BWDS" === this.api.g_opId ? this.constants.CFG_WARNING_BWDS : this.constants.CFG_WARNING)
                    }
                    ngOnInit() {
                        this.slidConfigForm = new d.cw({
                            newSlid: new d.NI({
                                value: "",
                                disabled: this.api.device_capability.getVal("maintenance", "slidConfiguration", "enterNewSlid").isDisabled
                            }),
                            slidMode: new d.NI({
                                value: "",
                                disabled: this.api.device_capability.getVal("maintenance", "slidConfiguration", "slidMode").isDisabled
                            })
                        }), this.getSlidConfigInfo(), this.pageRefresh()
                    }
                    pageRefresh() {
                        this.pageRefreshSub = this.pubSubService.subscribe(r.Y7.HEADER_REFRESH_CLICKED, t => {
                            this.getSlidConfigInfo()
                        })
                    }
                    getSlidConfigInfo() {
                        this.newSlid.setValue(""), this.api.request(this, "getSlidConfig")
                    }
                    saveSlidConfig() {
                        this.pureViewSnackbarService.hideMessageSnackbar(), this.slidValid = !0, this.slidError = "";
                        let t = this.newSlid.value;
                        const s = this.slidMode.value;
                        if (0 === s) {
                            if (!t.match(/^[0-9a-fA-F]{0,80}$/)) return this.slidValid = !1, this.slidError = this.constants.ERR_HEX_FORMAT, !1;
                            if (0 === t.length) return this.slidValid = !1, this.slidError = this.constants.VALID_SLID_VALUE, !1;
                            if (t.length > 20) return this.slidValid = !1, this.slidError = this.constants.ERR_MAX_20CHAR, !1
                        } else {
                            if (t = t.trim(), !this.isValidAscii(t)) return this.slidValid = !1, this.slidError = this.constants.ERR_ASCII_CHAR, !1;
                            if (0 === t.length || t.indexOf(" ") >= 0) return this.slidValid = !1, this.slidError = this.constants.VALID_SLID_VALUE, !1;
                            if (t.length > 10) return this.slidValid = !1, this.slidError = this.constants.ERR_MAX_10CHAR, !1;
                            if ("WILDCARD" === t) return this.slidValid = !1, this.slidError = `${t} ` + this.constants.IS_SYSTEM_DEFAULT_VALUE, !1
                        }
                        this.disableSave = !0;
                        const a = `pswd_mode=${s}&pswd_new=${t}`;
                        console.log(a), this.api.request(this, "setSlidConfig", a)
                    }
                    isValidAscii(t) {
                        return /^\w+$/.test(t)
                    }
                    ngOnDestroy() {
                        var t;
                        this.pureViewSnackbarService.hideMessageSnackbar(), null === (t = this.pageRefreshSub) || void 0 === t || t.unsubscribe()
                    }
                    showWarning(t) {
                        this.message.showMessage({
                            show: !0,
                            title: "",
                            width: "400px",
                            description: t,
                            buttonText: this.constants.OKAY_LABEL
                        })
                    }
                    onSuccess(t) {
                        const s = t.data;
                        switch (t.action) {
                            case r.eX.GET_ROUTER_INFO:
                                this.loadRouterInfo(this.api);
                                break;
                            case r.eX.GET_SLID_CONFIG:
                                this.slidMode.setValue(s.gpon_info.HexSLID), this.currentSlid = s.gpon_info.Password;
                                break;
                            case r.eX.SET_SLID_CONFIG:
                                this.disableSave = !1, this.getSlidConfigInfo(), this.showSaveIcon = !0, window.setTimeout(() => {
                                    this.showSaveIcon = !1
                                }, 1e3)
                        }
                    }
                    onError(t) {
                        switch (t.action) {
                            case r.eX.GET_ROUTER_INFO:
                                console.error("GET_ROUTER_INFO API Failed - Error"), console.error(t);
                                break;
                            case r.eX.GET_SLID_CONFIG:
                                console.error("GET_SLID_CONFIG API Failed - Error"), console.error(t);
                                break;
                            case r.eX.SET_SLID_CONFIG:
                                this.disableSave = !1, console.error("SET_SLID_CONFIG API Failed - Error"), console.error(t)
                        }
                    }
                }
                return i.\u0275fac = function(t) {
                    return new(t || i)(e.Y36(x.r), e.Y36(E.gT), e.Y36(m.s), e.Y36(l.jR), e.Y36(l.Lw), e.Y36(C.o))
                }, i.\u0275cmp = e.Xpm({
                    type: i,
                    selectors: [
                        ["app-slid"]
                    ],
                    decls: 8,
                    vars: 5,
                    consts: [
                        [3, "formGroup"],
                        ["formRef", ""],
                        ["pb-4", "", 3, "disabled", "hasBorder", "rowLayout", 4, "ngIf"],
                        [1, "flex-row"],
                        ["type", "submit", "buttonType", "submit", "size", "small", "mr-2", "", 3, "isDisabled", "webSave", "showButtonLoader", "title", "onClick", 4, "ngIf"],
                        ["pb-4", "", 3, "disabled", "hasBorder", "rowLayout"],
                        [3, "title"],
                        ["subtext3-bold", "", 3, "title"],
                        [1, "slid__form-control"],
                        ["size", "MEDIUM", "formControlName", "newSlid", "maxlength", "80", 3, "isValidated", "errorMessage", "hideErrorIcon"],
                        ["subtext2-regular-800", "", "mt-4", "", 3, "title", 4, "ngIf"],
                        ["formControlName", "slidMode", "size", "MEDIUM"],
                        [3, "label", "value", 4, "ngFor", "ngForOf"],
                        ["subtext2-regular-800", "", "mt-4", "", 3, "title"],
                        [3, "label", "value"],
                        ["type", "submit", "buttonType", "submit", "size", "small", "mr-2", "", 3, "isDisabled", "webSave", "showButtonLoader", "title", "onClick"]
                    ],
                    template: function(t, s) {
                        1 & t && (e.TgZ(0, "pv-card")(1, "form", 0, 1), e.YNc(3, De, 4, 5, "pv-form-field", 2), e.YNc(4, Oe, 5, 7, "pv-form-field", 2), e.YNc(5, Me, 8, 7, "pv-form-field", 2), e.TgZ(6, "div", 3), e.YNc(7, ye, 1, 4, "pv-button", 4), e.qZA()()()), 2 & t && (e.xp6(1), e.Q6J("formGroup", s.slidConfigForm), e.xp6(2), e.Q6J("ngIf", s.api.device_capability.getVal("maintenance", "slidConfiguration", "currentSlid").isOn), e.xp6(1), e.Q6J("ngIf", s.api.device_capability.getVal("maintenance", "slidConfiguration", "enterNewSlid").isOn), e.xp6(1), e.Q6J("ngIf", s.api.device_capability.getVal("maintenance", "slidConfiguration", "slidMode").isOn), e.xp6(2), e.Q6J("ngIf", s.api.device_capability.getVal("maintenance", "slidConfiguration", "saveButton").isOn))
                    },
                    dependencies: [f.sg, f.O5, d._Y, d.JJ, d.JL, d.nD, l.J8, l.ci, l.g4, l.fC, l.tB, l._H, l.ON, d.sg, d.u],
                    styles: [".slid__form-control[_ngcontent-%COMP%]{width:300px}"]
                }), i
            })();
            var w = h(7206),
                M = h(4071);

            function ke(i, n) {
                if (1 & i && e._UZ(0, "pv-text", 13), 2 & i) {
                    const t = e.oxw(2);
                    e.Q6J("title", t.constants.INCORRECT_PASWWORD)
                }
            }

            function Ge(i, n) {
                if (1 & i) {
                    const t = e.EpF();
                    e.TgZ(0, "pv-card", 7)(1, "pv-form-field", 8)(2, "span")(3, "label"), e._UZ(4, "pv-text", 9), e.qZA(), e.YNc(5, ke, 1, 1, "pv-text", 10), e.qZA(), e.TgZ(6, "span", 11)(7, "pv-inputbox", 12), e.NdJ("onModelChange", function() {
                        e.CHM(t);
                        const a = e.oxw();
                        return e.KtG(a.onOPwdChange())
                    })("onPasswordToggle", function(a) {
                        e.CHM(t);
                        const o = e.oxw();
                        return e.KtG(o.onOriginalPasswordToggleEvent(a))
                    }), e.qZA()()()()
                }
                if (2 & i) {
                    const t = e.oxw();
                    e.xp6(1), e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "password", "originalPassword").isDisabled)("rowLayout", !0), e.xp6(3), e.Q6J("title", t.constants.ORIGINAL_PASSWORD), e.xp6(1), e.Q6J("ngIf", t.showIncorrectPassword), e.xp6(2), e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "password", "originalPassword").isDisabled)("isValidated", t.orgPwdValid)("type", t.originalPasswordShow ? "text" : "password")("showPassword", t.originalPasswordShow)("errorMessage", t.orgPwdErrorM)("hideErrorIcon", !0)
                }
            }

            function Ve(i, n) {
                if (1 & i && e._UZ(0, "pv-text", 19), 2 & i) {
                    const t = e.oxw(2);
                    e.Q6J("title", t.constants.PASSWORD_CHK_LETTERS)
                }
            }

            function Ue(i, n) {
                if (1 & i && e._UZ(0, "pv-text", 19), 2 & i) {
                    const t = e.oxw(2);
                    e.Q6J("title", t.constants.PASSWORD_CHK_LETTERS_FOR_BRZL)
                }
            }

            function Ze(i, n) {
                if (1 & i && e._UZ(0, "pv-text", 19), 2 & i) {
                    const t = e.oxw(2);
                    e.Q6J("title", t.constants.PASSWORD_CHK_LENGTH)
                }
            }

            function Je(i, n) {
                if (1 & i && e._UZ(0, "pv-text", 19), 2 & i) {
                    const t = e.oxw(2);
                    e.Q6J("title", t.constants.PASSWORD_CHK_LENGTH_10)
                }
            }

            function Be(i, n) {
                if (1 & i) {
                    const t = e.EpF();
                    e.TgZ(0, "pv-form-field", 14)(1, "span")(2, "label"), e._UZ(3, "pv-text", 9), e.qZA(), e.TgZ(4, "span", 15), e._UZ(5, "pv-vector", 16), e.YNc(6, Ve, 1, 1, "pv-text", 17), e.YNc(7, Ue, 1, 1, "pv-text", 17), e.qZA(), e.TgZ(8, "span", 18), e._UZ(9, "pv-vector", 16)(10, "pv-text", 19), e.qZA(), e.TgZ(11, "span", 18), e._UZ(12, "pv-vector", 16)(13, "pv-text", 19), e.qZA(), e.TgZ(14, "span", 18), e._UZ(15, "pv-vector", 16), e.YNc(16, Ze, 1, 1, "pv-text", 17), e.YNc(17, Je, 1, 1, "pv-text", 17), e.qZA()(), e.TgZ(18, "span", 11)(19, "pv-inputbox", 20), e.NdJ("onModelChange", function() {
                        e.CHM(t);
                        const a = e.oxw();
                        return e.KtG(a.onNewPwdChange())
                    })("onPasswordToggle", function(a) {
                        e.CHM(t);
                        const o = e.oxw();
                        return e.KtG(o.onNewPasswordToggleEvent(a))
                    }), e.qZA()()()
                }
                if (2 & i) {
                    const t = e.oxw();
                    e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "password", "newPassword").isDisabled)("hasBorder", !0)("rowLayout", !0), e.xp6(3), e.Q6J("title", t.constants.NEW_PASSWORD), e.xp6(2), e.Q6J("name", t.passwordChkIcon1), e.xp6(1), e.Q6J("ngIf", !t.isAnatelPwdChange), e.xp6(1), e.Q6J("ngIf", t.isAnatelPwdChange), e.xp6(2), e.Q6J("name", t.passwordChkIcon2), e.xp6(1), e.Q6J("title", t.constants.PASSWORD_CHK_NUMBERS), e.xp6(2), e.Q6J("name", t.passwordChkIcon3), e.xp6(1), e.Q6J("title", t.constants.PASSWORD_CHK_SPL_CHARS), e.xp6(2), e.Q6J("name", t.passwordChkIcon4), e.xp6(1), e.Q6J("ngIf", !t.isMaxLength10), e.xp6(1), e.Q6J("ngIf", t.isMaxLength10), e.xp6(2), e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "password", "newPassword").isDisabled)("isValidated", t.newPwdValid)("type", t.newPasswordShow ? "text" : "password")("showEyeIcon", !0)("showPassword", t.newPasswordShow)("maxlength", 64)("errorMessage", t.newPwdErrorM)("hideErrorIcon", !0)
                }
            }

            function We(i, n) {
                if (1 & i && e._UZ(0, "pv-text", 13), 2 & i) {
                    const t = e.oxw(2);
                    e.Q6J("title", t.constants.PASSWORD_UNMATCHED)
                }
            }

            function Qe(i, n) {
                if (1 & i && e._UZ(0, "pv-text", 23), 2 & i) {
                    const t = e.oxw(2);
                    e.Q6J("title", t.constants.PASSWORD_MATCHED)
                }
            }

            function Ye(i, n) {
                if (1 & i) {
                    const t = e.EpF();
                    e.TgZ(0, "pv-form-field", 14)(1, "span")(2, "label"), e._UZ(3, "pv-text", 9), e.qZA(), e.YNc(4, We, 1, 1, "pv-text", 10), e.YNc(5, Qe, 1, 1, "pv-text", 21), e.qZA(), e.TgZ(6, "span", 11)(7, "pv-inputbox", 22), e.NdJ("onModelChange", function() {
                        e.CHM(t);
                        const a = e.oxw();
                        return e.KtG(a.onReEnterPwdChange())
                    })("onPasswordToggle", function(a) {
                        e.CHM(t);
                        const o = e.oxw();
                        return e.KtG(o.onReEnterPasswordToggleEvent(a))
                    }), e.qZA()()()
                }
                if (2 & i) {
                    const t = e.oxw();
                    e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "password", "reEnterPassword").isDisabled)("hasBorder", !0)("rowLayout", !0), e.xp6(3), e.Q6J("title", t.constants.REPEAT_NEW_PASSWORD), e.xp6(1), e.Q6J("ngIf", t.showPasswordMismatch), e.xp6(1), e.Q6J("ngIf", t.showPasswordMatch), e.xp6(2), e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "password", "reEnterPassword").isDisabled)("isValidated", t.confirmValid)("type", t.reEnterPasswordShow ? "text" : "password")("showEyeIcon", !0)("showPassword", t.reEnterPasswordShow)("maxlength", 64)("errorMessage", t.confirmErrorM)("hideErrorIcon", !0)
                }
            }

            function He(i, n) {
                if (1 & i && (e.TgZ(0, "pv-form-field", 14)(1, "span")(2, "label"), e._UZ(3, "pv-text", 9), e.qZA(), e._UZ(4, "pv-text", 24), e.qZA(), e.TgZ(5, "span", 11), e._UZ(6, "pv-inputbox", 25), e.qZA()()), 2 & i) {
                    const t = e.oxw();
                    e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "password", "promptMessage").isDisabled)("hasBorder", !0)("rowLayout", !0), e.xp6(3), e.Q6J("title", t.constants.PROMPT_MESSAGE), e.xp6(1), e.Q6J("title", t.constants.PASSWORD_HINT), e.xp6(2), e.Q6J("disabled", t.api.device_capability.getVal("maintenance", "password", "promptMessage").isDisabled)("isValidated", t.promptValid)("errorMessage", t.promptErrorM)("hideErrorIcon", !0)
                }
            }

            function qe(i, n) {
                if (1 & i) {
                    const t = e.EpF();
                    e.TgZ(0, "pv-button", 26), e.NdJ("onClick", function() {
                        e.CHM(t);
                        const a = e.oxw();
                        return e.KtG(a.submitPassword())
                    }), e.qZA()
                }
                if (2 & i) {
                    const t = e.oxw();
                    e.Q6J("isDisabled", t.disableSave || t.api.device_capability.getVal("maintenance", "password", "saveButton").isDisabled)("webSave", t.showSaveIcon)("showButtonLoader", t.disableButton)("title", t.constants.SAVE)
                }
            }
            var Xe = Module.cwrap("sha256_crypt", "string", ["string", "string"]);
            let ze = (() => {
                class i {
                    constructor(t, s, a, o, c, p, _, g, u) {
                        this.appAccessService = t, this.constants = s, this.api = a, this.gconfig = o, this.message = c, this.pureViewSnackbarService = p, this.pubSubService = _, this.authservice = g, this.alertUtil = u, this.newPasswordShow = !1, this.originalPasswordShow = !1, this.reEnterPasswordShow = !1, this.showIncorrectPassword = !1, this.showPasswordMismatch = !1, this.showPasswordMatch = !1, this.disableSave = !0, this.disableButton = !1, this.showSaveIcon = !1, this.passwordChkIcon1 = "circle_gray", this.passwordChkIcon2 = "circle_gray", this.passwordChkIcon3 = "circle_gray", this.passwordChkIcon4 = "circle_gray", this.displayOriginalPassword = !1, this.passwordRules = [], this.isCFGMode = !1, this.pwdVerifyMode = !1, this.salt = "", this.isSecurityComplianceOPID = !1, this.orgPwdValid = !0, this.newPwdValid = !0, this.confirmValid = !0, this.promptValid = !0, this.orgPwdErrorM = "", this.newPwdErrorM = "", this.confirmErrorM = "", this.promptErrorM = "", this.isAdmin = !1, this.passwordForm = new d.cw({
                            orgPwd: new d.NI({
                                value: "",
                                disabled: this.api.device_capability.getVal("maintenance", "password", "originalPassword").isDisabled
                            }),
                            newPwd: new d.NI({
                                value: "",
                                disabled: this.api.device_capability.getVal("maintenance", "password", "newPassword").isDisabled
                            }),
                            confirmPwd: new d.NI({
                                value: "",
                                disabled: this.api.device_capability.getVal("maintenance", "password", "reEnterPassword").isDisabled
                            }),
                            promptMsg: new d.NI({
                                value: "",
                                disabled: this.api.device_capability.getVal("maintenance", "password", "promptMessage").isDisabled
                            })
                        }), this.isStarHubOpid = !1, this.isMaxLength10 = !1, this.isAnatelPwdChange = !1, this.currentUserName = "", "" !== this.api.router_info.gwmodel ? this.loadRouterInfo(this.api) : this.api.request(this, "getRouterInfo")
                    }
                    loadRouterInfo(t) {
                        var s, a;
                        this.isCFGMode = -1 === t.brEnable, this.isStarHubOpid = "BSGS" === (null === (s = this.api) || void 0 === s ? void 0 : s.g_opId) || "SHXX" === (null === (a = this.api) || void 0 === a ? void 0 : a.g_opId), this.isMaxLength10 = this.isStarHubOpid || this.api.isFWADevice, this.isCFGMode && this.showWarning("BWDS" === this.api.g_opId ? this.constants.CFG_WARNING_BWDS : this.constants.CFG_WARNING), this.displayOriginalPassword = this.api.device_capability.getVal("maintenance", "password", "originalPassword").isOn, null != t.type && "BSGS" === t.g_opId.toString() && (this.isSecurityComplianceOPID = !0)
                    }
                    ngOnInit() {
                        var t;
                        this.isAdmin = null === (t = this.authservice) || void 0 === t ? void 0 : t.isAdmin, this.confirmPwd.disable(), this.api.get_password_info.pwd_check_rule.length > 0 && this.syncPasswordData(this.api.get_password_info), this.getPasswordDetails(), this.pageRefresh()
                    }
                    pageRefresh() {
                        this.pageRefreshSub = this.pubSubService.subscribe(r.Y7.HEADER_REFRESH_CLICKED, t => {
                            this.getPasswordDetails()
                        })
                    }
                    checkAnatelPwdChange() {
                        return this.passwordRules.some(t => "The password should use at least one uppercase letter, one lowercase letter, one number, and one special character" === t.error)
                    }
                    getPasswordDetails() {
                        this.resetInputFields(), this.api.request(this, "getPasswordInfo")
                    }
                    resetInputFields() {
                        this.orgPwd.setValue(""), this.newPwd.setValue(""), this.confirmPwd.setValue(""), this.promptMsg.setValue(""), this.disableSave = !0, this.passwordChkIcon1 = "circle_gray", this.passwordChkIcon2 = "circle_gray", this.passwordChkIcon3 = "circle_gray", this.passwordChkIcon4 = "circle_gray", this.showPasswordMatch = !1
                    }
                    syncPasswordData(t) {
                        var s, a;
                        this.displayOriginalPassword = this.api.device_capability.getVal("maintenance", "password", "originalPassword").isOn, this.currentUserName = this.api.isAdmin ? null === (s = t?.telemex_cfg) || void 0 === s ? void 0 : s.UserName : null === (a = t?.login_cfg) || void 0 === a ? void 0 : a.UserName, this.passwordRules = t.pwd_check_rule, this.salt = t.salt, this.isAnatelPwdChange = this.checkAnatelPwdChange()
                    }
                    get orgPwd() {
                        return this.passwordForm.get("orgPwd")
                    }
                    get newPwd() {
                        return this.passwordForm.get("newPwd")
                    }
                    get confirmPwd() {
                        return this.passwordForm.get("confirmPwd")
                    }
                    get promptMsg() {
                        return this.passwordForm.get("promptMsg")
                    }
                    onNewPasswordToggleEvent(t) {
                        this.newPasswordShow = t
                    }
                    onOriginalPasswordToggleEvent(t) {
                        this.originalPasswordShow = t
                    }
                    onReEnterPasswordToggleEvent(t) {
                        this.reEnterPasswordShow = t
                    }
                    onOPwdChange() {
                        this.displayOriginalPassword = this.api.device_capability.getVal("maintenance", "password", "originalPassword").isOn, this.displayOriginalPassword ? "" !== this.orgPwd.value && "" !== this.newPwd.value && "" !== this.confirmPwd.value && this.newPwd.value == this.confirmPwd.value && (this.disableSave = !1) : "" !== this.newPwd.value && "" !== this.confirmPwd.value && this.newPwd.value == this.confirmPwd.value && (this.disableSave = !1)
                    }
                    onNewPwdChange() {
                        this.checkPasswordRules(), this.displayOriginalPassword = this.api.device_capability.getVal("maintenance", "password", "originalPassword").isOn, this.displayOriginalPassword ? "" !== this.orgPwd.value && "" !== this.newPwd.value && "" !== this.confirmPwd.value && (this.disableSave = !1) : "" !== this.newPwd.value && "" !== this.confirmPwd.value && (this.disableSave = !1), this.checkPasswordMatch()
                    }
                    onReEnterPwdChange() {
                        this.displayOriginalPassword = this.api.device_capability.getVal("maintenance", "password", "originalPassword").isOn, this.displayOriginalPassword ? "" !== this.orgPwd.value && "" !== this.newPwd.value && "" !== this.confirmPwd.value && (this.disableSave = !1) : "" !== this.newPwd.value && "" !== this.confirmPwd.value && (this.disableSave = !1), this.checkPasswordMatch()
                    }
                    showAlert() {
                        this.alertUtil.showAlert({
                            title: this.constants.WARNING,
                            SHOW_DEFAULT_BUTTON: !1,
                            SHOW_HEADER_CLOSE_BUTTON: !1,
                            CALLBACK_2_TITLE: this.constants.OKAY_LABEL,
                            message: this.constants.PWD_ERROR_FOUR
                        }, () => {}, () => {
                            console.log("Callback 2 - Enable"), this.authservice.logout()
                        })
                    }
                    onPasswordUpdate(t) {
                        if (this.pwdVerifyMode) switch (t.ret) {
                            case 1:
                                this.showWarning(this.constants.PWD_CHANGES_SUCCESS);
                                break;
                            case 100:
                                this.showWarning(this.constants.ISUSERNAMEPRESENTPROMPT);
                                break;
                            case 101:
                                this.showWarning(this.constants.RESUSELASTPSWDPROMPT);
                                break;
                            case 102:
                                this.showWarning(this.constants.NOTEXPIREDPROMPT);
                                break;
                            case 103:
                                this.showWarning(this.constants.ISDICTWORDPROMPT);
                                break;
                            case 104:
                                this.showWarning(this.constants.ILLEGALCHARACTERRULE);
                                break;
                            case 105:
                                this.showWarning(this.isMaxLength10 ? this.constants.MINILENRULE_10 : this.constants.MINILENRULE);
                                break;
                            case 106:
                                this.showWarning(this.constants.MAXLENRULE);
                                break;
                            case 107:
                                this.showWarning(this.constants.FIRSTSPECIALRULE);
                                break;
                            case 108:
                                this.showWarning(this.constants.MINICLASSRULE_ERR);
                                break;
                            case 109:
                                this.showWarning(this.isSecurityComplianceOPID ? this.constants.SAMECHARRULE_HIGHT : this.constants.SAMECHARRULE);
                                break;
                            case 110:
                                this.showWarning(this.constants.ORIGINAL_PWD_ERR);
                                break;
                            default:
                                this.showWarning(this.constants.INTERNALERROR)
                        } else switch (t.ret) {
                            case 1:
                                this.showWarning(this.constants.PWD_CHANGES_SUCCESS);
                                break;
                            case 101:
                                this.showWarning(this.constants.PWD_SAME_BEFORE_ERR);
                                break;
                            case 103:
                                this.showWarning(this.constants.PWD_IN_DICT_ERR);
                                break;
                            case 100:
                                this.showWarning(this.constants.PWD_WITH_USER_ERR);
                                break;
                            case 10:
                                this.showWarning(this.constants.PWD_ERROR_ONE);
                                break;
                            case 20:
                                this.showWarning(this.constants.PWD_ERROR_TWO);
                                break;
                            case 30:
                                this.showWarning(this.constants.PWD_ERROR_THREE);
                                break;
                            case 40:
                                this.showAlert();
                                break;
                            default:
                                this.showWarning(this.constants.ORIGINAL_PWD_ERR)
                        }
                        this.resetInputFields()
                    }
                    onPasswordUpdateFWA(t) {
                        if (0 !== t.result) return 1 === t.result && "Can not use history password" === t.reason ? (this.showWarning(this.constants.PWD_SAME_BEFORE_ERR), !1) : 5 === t.result ? (this.showWarning(this.constants.INTERNALERROR), !1) : (this.showWarning(this.constants.ORIGINAL_PWD_ERR), !1);
                        this.showWarning(this.constants.PWD_CHANGES_SUCCESS)
                    }
                    checkPasswordRules() {
                        if (this.newPwd.value) {
                            let t = /[A-Z]/.test(this.newPwd.value),
                                s = /[a-z]/.test(this.newPwd.value);
                            this.passwordChkIcon1 = this.isAnatelPwdChange ? t && s ? "green_tick" : "circle_gray" : new RegExp("[a-zA-Z]").test(this.newPwd.value) ? "green_tick" : "circle_gray", this.passwordChkIcon2 = new RegExp("[0-9]").test(this.newPwd.value) ? "green_tick" : "circle_gray", this.passwordChkIcon3 = new RegExp("[!#+,-./:=@_]").test(this.newPwd.value) && !new RegExp('[$%^&*()~`{}<>?"|\\\\]').test(this.newPwd.value) ? new RegExp("[\\s]").test(this.newPwd.value) ? "circle_gray" : "green_tick" : "circle_gray", this.passwordChkIcon4 = !this.isMaxLength10 && this.newPwd.value.trim().length >= 8 || this.isMaxLength10 && this.newPwd.value.trim().length >= 10 ? "green_tick" : "circle_gray"
                        } else this.passwordChkIcon1 = "circle_gray", this.passwordChkIcon2 = "circle_gray", this.passwordChkIcon3 = "circle_gray", this.passwordChkIcon4 = "circle_gray"
                    }
                    resetAll() {
                        this.newPwdValid = !0, this.orgPwdValid = !0, this.confirmValid = !0, this.promptValid = !0, this.newPwdErrorM = "", this.orgPwdErrorM = "", this.confirmErrorM = "", this.promptErrorM = ""
                    }
                    submitPassword() {
                        this.resetAll();
                        var t = !0;
                        "circle_gray" === this.passwordChkIcon1 && (this.passwordChkIcon1 = "alert_red"), "circle_gray" === this.passwordChkIcon2 && (this.passwordChkIcon2 = "alert_red"), "circle_gray" === this.passwordChkIcon3 && (this.passwordChkIcon3 = "alert_red"), "circle_gray" === this.passwordChkIcon4 && (this.passwordChkIcon4 = "alert_red"), this.checkSubmitValid() || (t = !1), this.checkPasswordMatch() || (t = !1), t && (console.log(this.passwordForm.value), this.triggerPasswordChange())
                    }
                    triggerPasswordChange() {
                        const t = this.newPwd.value,
                            s = this.confirmPwd.value,
                            a = this.orgPwd.value;
                        let o;
                        if (this.displayOriginalPassword && 0 === a.length) return this.showWarning(this.constants.ERR_INPUT_PWD), !1;
                        if (a === t) return this.showWarning(this.constants.SAMEPSWDPROMPT), this.passwordForm.reset(), this.resetInputFields(), !1;
                        if (t !== s) return this.showWarning(this.constants.ERR_CONFIRM_PWD), !1;
                        if (this.isMaxLength10 && t == this.currentUserName) return this.showWarning(this.constants.PASSWORD_MATCH_USERNAME), !1;
                        for (const p of this.passwordRules)
                            if (p.regexp_reverse) {
                                if (new RegExp(p.regexp_reverse).test(t)) return this.showWarning(p.error), !1
                            } else if (p.regexp && !new RegExp(p.regexp).test(t)) return this.showWarning(p.error), !1;
                        1 == this.isSecurityComplianceOPID && (o = Xe(a, this.salt)), this.disableButton = !0;
                        let c = "";
                        this.api.isFWADevice ? this.doPasswordChangeFWA(t, s, a) : (c = 1 == this.isSecurityComplianceOPID ? `txtPassword=&upswd=${encodeURIComponent(o)}&pswdNew=${encodeURIComponent(t)}&pswdConfirm=${encodeURIComponent(s)}&pwdMsg=${this.promptMsg.value}` : `txtPassword=&upswd=${encodeURIComponent(a)}&pswdNew=${encodeURIComponent(t)}&pswdConfirm=${encodeURIComponent(s)}&pwdMsg=${this.promptMsg.value}&upswdHash=${o}`, console.log(c), this.api.request(this, "setPasswordInfo", c))
                    }
                    doPasswordChangeFWA(t, s, a) {
                        let o = localStorage.getItem("iterations");
                        if (this.salt = localStorage.getItem("alati"), this.iterations = parseInt(o), this.iterations > 0) {
                            let b = "";
                            b = w.SHA256(this.salt + a).toString();
                            for (let R = 1; R < this.iterations; R++) {
                                var c = w.enc.Hex.parse(b);
                                b = w.SHA256(c).toString()
                            }
                            let S = "";
                            S = w.SHA256(this.salt + t).toString();
                            for (let R = 1; R < this.iterations; R++) {
                                var p = w.enc.Hex.parse(S);
                                S = w.SHA256(p).toString()
                            }
                            var _ = w.enc.Hex.parse(b),
                                g = w.enc.Hex.parse("30303030303030303030303030303030"),
                                v = w.AES.encrypt(S + ":" + b, _, {
                                    iv: g,
                                    mode: w.mode.CFB,
                                    padding: w.pad.NoPadding
                                });
                            let A = '[{"Source": "web"},{"SessionID": "1"},{"UserName": "' + localStorage.getItem("currentUser") + '"},{"PasswordType": 2},{"Password": "30303030303030303030303030303030:' + v.ciphertext.toString() + '"}]';
                            console.log(A), this.api.createBody("ChangePassword", A), this.api.request(this, "setFWAPassword")
                        }
                    }
                    checkPasswordMatch() {
                        return this.checkSubmitValid() ? (this.confirmPwd.enable(), "" === this.newPwd.value || "" === this.confirmPwd.value ? (this.confirmValid = !0, this.confirmErrorM = " ", this.showPasswordMatch = !1, this.showPasswordMismatch = !1, !1) : this.newPwd.value !== this.confirmPwd.value ? (this.showPasswordMismatch = !0, this.showPasswordMatch = !1, this.confirmValid = !1, this.confirmErrorM = " ", this.disableSave = !0, !1) : "" !== this.newPwd.value && "" !== this.confirmPwd.value ? (this.confirmValid = !0, this.newPwdValid = !0, this.showPasswordMatch = !0, this.showPasswordMismatch = !1, this.disableSave = !1, !0) : void 0) : (this.confirmPwd.disable(), this.showPasswordMismatch = !1, this.showPasswordMatch = !1, this.confirmValid = !0, "" == this.newPwd.value && "" == this.confirmPwd.value && (this.newPwdValid = !0), this.disableSave = !0, !1)
                    }
                    checkSubmitValid() {
                        return "circle_gray" === this.passwordChkIcon1 || "circle_gray" === this.passwordChkIcon2 || "circle_gray" === this.passwordChkIcon3 || "circle_gray" === this.passwordChkIcon4 || "alert_red" === this.passwordChkIcon1 || "alert_red" === this.passwordChkIcon2 || "alert_red" === this.passwordChkIcon3 || "alert_red" === this.passwordChkIcon4 ? (this.newPwdValid = !1, this.newPwdErrorM = " ", !1) : (this.newPwdValid = !0, !0)
                    }
                    showWarning(t) {
                        this.message.showMessage({
                            show: !0,
                            title: "",
                            width: "340px",
                            description: t,
                            buttonText: this.constants.OKAY_LABEL
                        })
                    }
                    ngOnDestroy() {
                        var t;
                        this.pureViewSnackbarService.hideMessageSnackbar(), null === (t = this.pageRefreshSub) || void 0 === t || t.unsubscribe()
                    }
                    onSuccess(t) {
                        const s = t.data;
                        switch (t.action) {
                            case r.eX.GET_ROUTER_INFO:
                                this.loadRouterInfo(this.api);
                                break;
                            case r.eX.GET_PASSWORD_INFO:
                                this.syncPasswordData(s);
                                break;
                            case r.eX.SET_PASSWORD_INFO:
                                this.onPasswordUpdate(s), this.disableButton = !1;
                                break;
                            case r.eX.SET_FWA_PASSWORD:
                                this.onPasswordUpdateFWA(s), this.disableButton = !1
                        }
                    }
                    onError(t) {
                        switch (t.action) {
                            case r.eX.GET_ROUTER_INFO:
                                console.error("GET_ROUTER_INFO API Failed - Error"), console.error(t);
                                break;
                            case r.eX.GET_PASSWORD_INFO:
                                console.error("GET_PASSWORD_INFO API Failed - Error"), console.error(t);
                                break;
                            case r.eX.SET_PASSWORD_INFO:
                                this.disableSave = !1, this.disableButton = !1, console.error("SET_PASSWORD_INFO API Failed - Error"), console.error(t)
                        }
                    }
                }
                return i.\u0275fac = function(t) {
                    return new(t || i)(e.Y36(x.r), e.Y36(E.gT), e.Y36(m.s), e.Y36(N.O), e.Y36(l.Lw), e.Y36(l.jR), e.Y36(C.o), e.Y36(k.e), e.Y36(M.r))
                }, i.\u0275cmp = e.Xpm({
                    type: i,
                    selectors: [
                        ["app-password"]
                    ],
                    decls: 10,
                    vars: 6,
                    consts: [
                        [1, "flex-column", "grid-gap-24", "password"],
                        [3, "formGroup"],
                        ["formRef", ""],
                        ["mb-20", "", 4, "ngIf"],
                        ["pb-4", "", "labelAlign", "top", 3, "disabled", "hasBorder", "rowLayout", 4, "ngIf"],
                        [1, "flex-row"],
                        ["type", "submit", "buttonType", "submit", "size", "small", "mr-2", "", 3, "isDisabled", "webSave", "showButtonLoader", "title", "onClick", 4, "ngIf"],
                        ["mb-20", ""],
                        ["labelAlign", "top", 3, "disabled", "rowLayout"],
                        ["mt-2", "", 3, "title"],
                        ["subtext3-red", "", "mt-4", "", 3, "title", 4, "ngIf"],
                        [1, "password__form-control"],
                        ["size", "MEDIUM", "formControlName", "orgPwd", "showEyeIcon", "true", "isPasswordRules", "true", 3, "disabled", "isValidated", "type", "showPassword", "errorMessage", "hideErrorIcon", "onModelChange", "onPasswordToggle"],
                        ["subtext3-red", "", "mt-4", "", 3, "title"],
                        ["pb-4", "", "labelAlign", "top", 3, "disabled", "hasBorder", "rowLayout"],
                        ["mt-4", "", 1, "password__icon-text"],
                        [3, "name"],
                        ["subtext2-regular-800", "", 3, "title", 4, "ngIf"],
                        [1, "password__icon-text"],
                        ["subtext2-regular-800", "", 3, "title"],
                        ["size", "MEDIUM", "formControlName", "newPwd", "isPasswordRules", "true", 3, "disabled", "isValidated", "type", "showEyeIcon", "showPassword", "maxlength", "errorMessage", "hideErrorIcon", "onModelChange", "onPasswordToggle"],
                        ["subtext3-green", "", "mt-4", "", 3, "title", 4, "ngIf"],
                        ["size", "MEDIUM", "formControlName", "confirmPwd", "isPasswordRules", "true", 3, "disabled", "isValidated", "type", "showEyeIcon", "showPassword", "maxlength", "errorMessage", "hideErrorIcon", "onModelChange", "onPasswordToggle"],
                        ["subtext3-green", "", "mt-4", "", 3, "title"],
                        ["subtext2-regular-800", "", "mt-4", "", 3, "title"],
                        ["size", "MEDIUM", "formControlName", "promptMsg", 3, "disabled", "isValidated", "errorMessage", "hideErrorIcon"],
                        ["type", "submit", "buttonType", "submit", "size", "small", "mr-2", "", 3, "isDisabled", "webSave", "showButtonLoader", "title", "onClick"]
                    ],
                    template: function(t, s) {
                        1 & t && (e.TgZ(0, "div", 0)(1, "form", 1, 2), e.YNc(3, Ge, 8, 10, "pv-card", 3), e.TgZ(4, "pv-card"), e.YNc(5, Be, 20, 22, "pv-form-field", 4), e.YNc(6, Ye, 8, 14, "pv-form-field", 4), e.YNc(7, He, 7, 9, "pv-form-field", 4), e.TgZ(8, "div", 5), e.YNc(9, qe, 1, 4, "pv-button", 6), e.qZA()()()()), 2 & t && (e.xp6(1), e.Q6J("formGroup", s.passwordForm), e.xp6(2), e.Q6J("ngIf", s.api.device_capability.getVal("maintenance", "password", "originalPassword").isOn), e.xp6(2), e.Q6J("ngIf", s.api.device_capability.getVal("maintenance", "password", "newPassword").isOn), e.xp6(1), e.Q6J("ngIf", s.api.device_capability.getVal("maintenance", "password", "reEnterPassword").isOn), e.xp6(1), e.Q6J("ngIf", s.api.device_capability.getVal("maintenance", "password", "promptMessage").isOn), e.xp6(2), e.Q6J("ngIf", s.api.device_capability.getVal("maintenance", "password", "saveButton").isOn))
                    },
                    dependencies: [f.O5, d._Y, d.JJ, d.JL, d.nD, l.J8, l.ci, l.g4, l.fC, l.pi, l.tB, d.sg, d.u],
                    styles: [".password__form-control[_ngcontent-%COMP%]{width:300px}.password__icon-text[_ngcontent-%COMP%]{display:flex;height:30px;align-items:center}"]
                }), i
            })();

            function Ke(i, n) {
                if (1 & i && e._UZ(0, "pv-text", 9), 2 & i) {
                    const t = e.oxw(2);
                    e.Q6J("title", t.constants.NO_FILE_SELECTED)
                }
            }

            function $e(i, n) {
                if (1 & i && e._UZ(0, "pv-text", 17), 2 & i) {
                    const t = e.oxw(2);
                    e.Q6J("title", t.fileName)
                }
            }

            function je(i, n) {
                if (1 & i) {
                    const t = e.EpF();
                    e.TgZ(0, "pv-button", 18), e.NdJ("onClick", function() {
                        e.CHM(t);
                        const a = e.oxw(2);
                        return e.KtG(a.onStartRecording())
                    }), e.qZA()
                }
                if (2 & i) {
                    const t = e.oxw(2);
                    e.Q6J("title", t.constants.START_RECORDING)
                }
            }

            function et(i, n) {
                if (1 & i) {
                    const t = e.EpF();
                    e.TgZ(0, "pv-button", 18), e.NdJ("onClick", function() {
                        e.CHM(t);
                        const a = e.oxw(2);
                        return e.KtG(a.onStopRecording())
                    }), e.qZA()
                }
                if (2 & i) {
                    const t = e.oxw(2);
                    e.Q6J("title", t.constants.STOP_RECORDING)
                }
            }

            function tt(i, n) {
                if (1 & i) {
                    const t = e.EpF();
                    e.TgZ(0, "pv-card", 4)(1, "pv-form-field", 5)(2, "label"), e._UZ(3, "pv-text", 6)(4, "pv-text", 8)(5, "pv-text", 9), e.qZA(), e.TgZ(6, "span", 10), e.YNc(7, Ke, 1, 1, "pv-text", 11), e.YNc(8, $e, 1, 1, "pv-text", 12), e.TgZ(9, "input", 13, 14), e.NdJ("change", function(a) {
                        e.CHM(t);
                        const o = e.oxw();
                        return e.KtG(o.uploadFile(a))
                    }), e.qZA(), e.TgZ(11, "pv-button", 15), e.NdJ("click", function() {
                        e.CHM(t);
                        const a = e.MAs(10);
                        return e.KtG(a.click())
                    }), e.qZA(), e.YNc(12, je, 1, 1, "pv-button", 16), e.YNc(13, et, 1, 1, "pv-button", 16), e.qZA()()()
                }
                if (2 & i) {
                    const t = e.oxw();
                    e.xp6(1), e.Q6J("hasBorder", !1)("rowLayout", !0), e.xp6(2), e.Q6J("title", t.constants.MERGE_DELTA_CFG), e.xp6(1), e.Q6J("title", t.constants.DELTA_CFG_DESCRIPTION1), e.xp6(1), e.Q6J("title", t.constants.DELTA_CFG_DESCRIPTION2), e.xp6(2), e.Q6J("ngIf", !1 === t.fileUploaded || t.isRefresh), e.xp6(1), e.Q6J("ngIf", null !== t.fileName && !t.isRefresh), e.xp6(3), e.Q6J("title", t.constants.SELECT_FILE_FIRMWARE), e.xp6(1), e.Q6J("ngIf", !t.recordingStatus), e.xp6(1), e.Q6J("ngIf", t.recordingStatus)
                }
            }

            function it(i, n) {
                if (1 & i) {
                    const t = e.EpF();
                    e.TgZ(0, "pv-button", 19), e.NdJ("click", function() {
                        e.CHM(t);
                        const a = e.oxw();
                        return e.KtG(a.onExport())
                    }), e.qZA()
                }
                if (2 & i) {
                    const t = e.oxw();
                    e.Q6J("title", t.constants.EXPORT)
                }
            }
            let st = (() => {
                class i {
                    constructor(t, s, a, o, c, p) {
                        this.constants = t, this.api = s, this.pubSubService = a, this.pureViewSnackbarService = o, this.validations = c, this.message = p, this.fileName = "", this.restoreStarted = !1, this.isCFGMode = !1, this.isSuccess = !0, this.isError = !1, this.fileUploaded = !1, this.importText = "", this.exportText = "", this.isRefresh = !1
                    }
                    pageRefresh() {
                        this.pageRefreshSub = this.pubSubService.subscribe(r.Y7.HEADER_REFRESH_CLICKED, t => {
                            this.api.request(this, "getRouterInfo")
                        })
                    }
                    uploadFile(t) {
                        this.api.recEnable && this.showWarning(this.constants.STOP_DELTACFG_FIRST), this.importText = "", this.isRefresh = !1, console.log(t.target.files[0]);
                        const s = new FileReader;
                        if (t.target.files && t.target.files.length > 0) {
                            this.fileUploaded = !0, this.file = t.target.files[0], this.fileName = t.target.files[0].name, this.formData = new FormData, this.formData.append("csrf_token", localStorage.getItem("token")), this.formData.append("filename", this.file);
                            const a = this.fileName.lastIndexOf(".");
                            this.filenameType = this.fileName.slice(a + 1, this.fileName.length);
                            const o = t.target.files[0].size / 1024 / 1024,
                                c = this.fileName.slice(0, a),
                                p = /^[0-9A-Za-z_.]+$/,
                                _ = (c.match(/\./g) || []).length;
                            if ("cfg" !== this.filenameType) return this.fileName = this.constants.INVALID_FILE_FORMAT, this.fileContent = "", this.isSuccess = !1, this.isError = !0, !1;
                            if (Math.floor(o) > 2) return this.fileContent = "", this.fileName = this.constants.FILE_SIZE_TOO_LARGE_UPLOAD_FAILED, this.isSuccess = !1, this.isError = !0, !1;
                            if (!p.test(c) || _ > 1) return this.fileName = this.constants.ILLEGAL_FILENAME, this.isSuccess = !1, this.isError = !0, this.fileContent = "", !1;
                            this.isSuccess = !0, this.isError = !1, s.readAsArrayBuffer(this.file), s.onload = () => {
                                let g = "";
                                const u = new Uint8Array(s.result),
                                    v = u.byteLength;
                                for (let b = 0; b < v; b++) g += String.fromCharCode(u[b]);
                                this.fileContent = g, console.log(this.fileContent)
                            }
                        }
                    }
                    onStartRecording() {
                        this.file && "cfg" !== this.filenameType ? this.showWarning(this.constants.CFG_FILE_WARNING) : this.file && this.filenameType ? (console.log(`start_rec= ${this.fileContent}`), this.api.request(this, "startRecDeltaCfg", this.formData), console.log(this.formData)) : this.api.request(this, "startRecDeltaCfg")
                    }
                    onStopRecording() {
                        this.api.request(this, "startRecDeltaCfg")
                    }
                    checkRecordStatus(t) {
                        t && (this.recordingStatus = t.is_record_flag_existed)
                    }
                    onExport() {
                        this.api.deltaCFGfileExists ? this.api.recEnable ? this.showWarning(this.constants.STOP_DELTACFG_FIRST) : (this.exportText = "", this.api.request(this, "exportDeltaCfg")) : this.showWarning(this.constants.CFG_FILENOTEXIST_WARNING)
                    }
                    createAndDownloadBlobFile(t, s, a) {
                        const o = new Blob([t], s);
                        if (navigator.msSaveBlob) navigator.msSaveBlob(o, a), this.exportText = "Success";
                        else {
                            const c = document.createElement("a");
                            if (void 0 !== c.download) {
                                const p = URL.createObjectURL(o);
                                c.setAttribute("href", p), c.setAttribute("download", a), c.style.visibility = "hidden", document.body.appendChild(c), c.click(), document.body.removeChild(c), this.exportText = "Success"
                            }
                        }
                    }
                    ngOnInit() {
                        "" !== this.api.router_info.gwmodel && (this.recordingStatus = this.api.router_info.is_record_flag_existed), this.api.request(this, "getRouterInfo"), this.pageRefresh()
                    }
                    showWarning(t) {
                        this.message.showMessage({
                            show: !0,
                            title: "",
                            width: "400px",
                            description: t,
                            buttonText: this.constants.OKAY_LABEL
                        })
                    }
                    onSuccess(t) {
                        const s = t.data;
                        switch (t.action) {
                            case r.eX.START_REC_DELTA_CFG:
                                console.warn("START_REC_DELTA_CFG API Called"), this.api.request(this, "getRouterInfo");
                                break;
                            case r.eX.GET_ROUTER_INFO:
                                this.checkRecordStatus(s), console.log("GET_ROUTER_INFO API called");
                                break;
                            case r.eX.EXPORT_DELTA_CFG:
                                this.createAndDownloadBlobFile(s, {
                                    type: "application/octet-stream"
                                }, "delta_config_result"), console.log("EXPORT_DELTA_CFG API called")
                        }
                    }
                    onError(t) {
                        switch (t.action) {
                            case r.eX.START_REC_DELTA_CFG:
                                console.warn("START_REC_DELTA_CFG API  Failed - Error");
                                break;
                            case r.eX.GET_ROUTER_INFO:
                                console.log("GET_ROUTER_INFO API  Failed - Error");
                                break;
                            case r.eX.EXPORT_DELTA_CFG:
                                console.log("EXPORT_DELTA_CFG API  Failed - Error")
                        }
                    }
                }
                return i.\u0275fac = function(t) {
                    return new(t || i)(e.Y36(E.gT), e.Y36(m.s), e.Y36(C.o), e.Y36(l.jR), e.Y36(P.l), e.Y36(l.Lw))
                }, i.\u0275cmp = e.Xpm({
                    type: i,
                    selectors: [
                        ["app-delta-cfg"]
                    ],
                    decls: 9,
                    vars: 6,
                    consts: [
                        [1, "flex-row", "flex-row__start-center", "text-highlight"],
                        ["name", "error_small_blue"],
                        ["mr-2", "", "subtext1-regular", "", 1, "text-color", 3, "title"],
                        ["mt-5", "", 4, "ngIf"],
                        ["mt-5", ""],
                        [3, "hasBorder", "rowLayout"],
                        ["body1-regular", "", 3, "title"],
                        ["size", "small", "type", "button", 3, "title", "click", 4, "ngIf"],
                        ["mt-3", "", "subtext1-regular", "", 3, "title"],
                        ["subtext1-regular", "", 3, "title"],
                        ["mb-8", "", 1, "flex-row", "flex-row__center"],
                        ["subtext1-regular", "", 3, "title", 4, "ngIf"],
                        ["mr-2", "", "subtext1-regular", "", 3, "title", 4, "ngIf"],
                        ["type", "file", 1, "pv-upload__input-file", 3, "change"],
                        ["uploader", ""],
                        ["mr-2", "", "outline", "button-lightBlue", "size", "small", "type", "button", 3, "title", "click"],
                        ["buttonType", "submit", "size", "small", "type", "button", 3, "title", "onClick", 4, "ngIf"],
                        ["mr-2", "", "subtext1-regular", "", 3, "title"],
                        ["buttonType", "submit", "size", "small", "type", "button", 3, "title", "onClick"],
                        ["size", "small", "type", "button", 3, "title", "click"]
                    ],
                    template: function(t, s) {
                        1 & t && (e.TgZ(0, "pv-card", 0), e._UZ(1, "pv-vector", 1)(2, "pv-text", 2), e.qZA(), e.YNc(3, tt, 14, 10, "pv-card", 3), e.TgZ(4, "pv-card", 4)(5, "pv-form-field", 5)(6, "label"), e._UZ(7, "pv-text", 6), e.qZA(), e.YNc(8, it, 1, 1, "pv-button", 7), e.qZA()()), 2 & t && (e.xp6(2), e.Q6J("title", s.constants.DELTA_CFG_WARNING), e.xp6(1), e.Q6J("ngIf", s.api.device_capability.getVal("maintenance", "deltaCfgTool", "mergeDeltaCfgFile").isOn), e.xp6(2), e.Q6J("hasBorder", !1)("rowLayout", !0), e.xp6(2), e.Q6J("title", s.constants.EXPORT_DELTA_CFG), e.xp6(1), e.Q6J("ngIf", s.api.device_capability.getVal("maintenance", "deltaCfgTool", "exportDeltaCfgButton").isOn))
                    },
                    dependencies: [f.O5, l.J8, l.g4, l.fC, l.pi, l.tB],
                    styles: [".text-highlight[_ngcontent-%COMP%]{display:flex;flex-direction:row;align-items:center;padding:16px;background:var(--pure-color-primary-10);border-radius:16px}.text-color[_ngcontent-%COMP%]{font-weight:400;font-size:16px;line-height:150%;letter-spacing:-.32px;color:var(--pure-color-primary-70);display:inline-block}"]
                }), i
            })();

            function at(i, n) {
                if (1 & i && (e.ynx(0), e._UZ(1, "pv-table", 1), e.BQk()), 2 & i) {
                    const t = e.oxw();
                    e.xp6(1), e.Q6J("pvTableTitle", t.constants.CONTAINER_APPS_STATUS)("pvDataTable", !0)("pvDataTableColum", t.containerHeader)("pvDataTableArray", t.containerData)
                }
            }
            let nt = (() => {
                class i {
                    constructor(t, s, a, o) {
                        this.constants = t, this.api = s, this.pubSubService = a, this.alertUtil = o, this.isLoading = !1, this.containerHeader = [{
                            label: this.constants.CONTAINER_APP_NAME,
                            value: "appName"
                        }, {
                            label: this.constants.CONTAINER_APP_VERSION,
                            value: "appVersion"
                        }, {
                            label: this.constants.STATUS_LABEL,
                            value: "appStatus"
                        }], this.containerData = []
                    }
                    ngOnInit() {
                        this.refreshPage(), this.onLanguageChanges(), console.log(this.api.get_container_info), this.isLoading = !0, this.alertUtil.showContentModalLoader(), this.api.get_container_info.DeploymentUnitNumberOfEntries > 0 && this.syncContainerData(this.api.get_container_info), this.getContainerMgmtInfo()
                    }
                    getContainerMgmtInfo() {
                        this.api.request(this, "getContainerData")
                    }
                    refreshPage() {
                        this.pageRefreshSub = this.pubSubService.subscribe(r.Y7.HEADER_REFRESH_CLICKED, t => {
                            this.getContainerMgmtInfo()
                        })
                    }
                    onLanguageChanges() {
                        this.langChangeSub = this.pubSubService.subscribe(r.Y7.LANGUAGE_CHANGE, t => {
                            this.containerHeader = [{
                                label: this.constants.CONTAINER_APP_NAME,
                                value: "appName"
                            }, {
                                label: this.constants.CONTAINER_APP_VERSION,
                                value: "appVersion"
                            }, {
                                label: this.constants.STATUS_LABEL,
                                value: "appStatus"
                            }], this.syncContainerData(this.api.get_container_info)
                        })
                    }
                    syncContainerData(t) {
                        if (console.log(this.api.get_container_info), this.isLoading = !1, this.alertUtil.hideContentModalLoader(), this.containerData = [], t.DeploymentUnitNumberOfEntries && t.DeploymentUnit.length)
                            for (let a of t.DeploymentUnit) {
                                var s = {
                                    appName: a.Name,
                                    appVersion: a.Version,
                                    appStatus: "Installed" != a.Status ? this.constants.APP_STATUS_INSTALLED : this.getInstalledAppStatus(a._iid, t.ExecutionUnit)
                                };
                                this.containerData.push(s)
                            }
                    }
                    getInstalledAppStatus(t, s) {
                        var a = "";
                        return s.forEach(o => {
                            t == o._iid && (a = "Idle" == o.Status ? this.constants.APP_STATUS_IDLE : "Active" == o.Status ? this.constants.ACTIVE : o.Status)
                        }), a
                    }
                    ngOnDestroy() {
                        var t;
                        this.isLoading = !1, null === (t = this.pageRefreshSub) || void 0 === t || t.unsubscribe(), this.alertUtil.hideContentModalLoader(), this.langChangeSub.unsubscribe()
                    }
                    onSuccess(t) {
                        t.action === r.eX.GET_CONTAINER_INFO && this.syncContainerData(t.data)
                    }
                    onError(t) {
                        t.action === r.eX.GET_CONTAINER_INFO && (this.isLoading = !1, this.alertUtil.hideContentModalLoader(), console.warn("GET_CONTAINER_INFO API  Failed - Error"))
                    }
                }
                return i.\u0275fac = function(t) {
                    return new(t || i)(e.Y36(E.gT), e.Y36(m.s), e.Y36(C.o), e.Y36(M.r))
                }, i.\u0275cmp = e.Xpm({
                    type: i,
                    selectors: [
                        ["app-container-management"]
                    ],
                    decls: 1,
                    vars: 1,
                    consts: [
                        [4, "ngIf"],
                        ["pb-6", "", 3, "pvTableTitle", "pvDataTable", "pvDataTableColum", "pvDataTableArray"]
                    ],
                    template: function(t, s) {
                        1 & t && e.YNc(0, at, 2, 4, "ng-container", 0), 2 & t && e.Q6J("ngIf", !s.isLoading)
                    },
                    dependencies: [f.O5, l.VU]
                }), i
            })();

            function ot(i, n) {
                if (1 & i) {
                    const t = e.EpF();
                    e.TgZ(0, "pv-card", 3)(1, "pv-form-field", 4)(2, "span")(3, "label"), e._UZ(4, "pv-text", 5), e.qZA()(), e.TgZ(5, "span", 6)(6, "pv-toggle", 7), e.NdJ("change", function() {
                        e.CHM(t);
                        const a = e.oxw();
                        return e.KtG(a.gameModeChange())
                    }), e.qZA()()()()
                }
                if (2 & i) {
                    const t = e.oxw();
                    e.xp6(1), e.Q6J("rowLayout", !0), e.xp6(3), e.Q6J("title", t.constants.ENABLE_LABEL), e.xp6(2), e.Q6J("isChecked", t.enable.value)
                }
            }
            const rt = [{
                path: "",
                redirectTo: "maintenance",
                pathMatch: "full"
            }, {
                path: "password",
                component: ze
            }, {
                path: "game-mode",
                component: (() => {
                    class i {
                        constructor(t, s, a, o, c) {
                            this.alertUtil = t, this.pubSubService = s, this.api = a, this.constants = o, this.message = c
                        }
                        ngOnInit() {
                            this.gameModeForm = new d.cw({
                                enable: new d.NI({
                                    value: !1,
                                    disabled: this.api.device_capability.getVal("maintenance", "gameMode", "enable").isDisabled
                                })
                            }), this.api.request(this, "getGameMode"), this.refreshPage()
                        }
                        ngOnDestroy() {
                            this.alertUtil.hideModalLoader()
                        }
                        setGameMode() {
                            this.alertUtil.showModalLoader();
                            const t = `bufferbloat_enable=${this.enable.value?1:0}&isReboot=1`;
                            console.log("SET GAME MODE :" + t), this.api.request(this, "setGameMode", t)
                        }
                        refreshPage() {
                            this.pageRefreshSub = this.pubSubService.subscribe(r.Y7.HEADER_REFRESH_CLICKED, t => {
                                this.api.request(this, "getGameMode")
                            })
                        }
                        gameModeChange() {
                            this.alertUtil.showAlert({
                                title: this.constants.REBOOT_DEVICE,
                                SHOW_DEFAULT_BUTTON: !1,
                                SHOW_HEADER_CLOSE_BUTTON: !1,
                                CALLBACK_1_TITLE: this.constants.CANCEL,
                                CALLBACK_2_TITLE: this.constants.ACTION_SHEET_DEVICE_ALREADY_ASSIGNED_BTN_OK,
                                message: this.constants.GAME_MODE_DESC
                            }, () => {
                                this.enable.setValue(!this.enable.value)
                            }, () => {
                                this.setGameMode()
                            })
                        }
                        showWarning(t, s) {
                            this.message.showMessage({
                                show: !0,
                                title: this.constants.REBOOT_DEVICE,
                                width: "340px",
                                cssClass: "gameMode",
                                description: t,
                                deleteBtn: this.constants.ACTION_SHEET_DEVICE_ALREADY_ASSIGNED_BTN_OK,
                                cancelBtn: this.constants.CANCEL_LABEL,
                                buttonText: null,
                                data: s
                            })
                        }
                        updateGameModeData(t) {
                            this.enable.setValue(null), setTimeout(() => {
                                this.enable.setValue(!!t.bufferbloat_config.Enable)
                            }, 0)
                        }
                        onSuccess(t) {
                            const s = t.data;
                            switch (t.action) {
                                case r.eX.GET_GAME_MODE:
                                    s && s.bufferbloat_config && (this.alertUtil.hideModalLoader(), this.updateGameModeData(s));
                                    break;
                                case r.eX.SET_GAME_MODE:
                                    this.alertUtil.hideModalLoader()
                            }
                        }
                        onError(t) {
                            switch (t.action) {
                                case r.eX.GET_GAME_MODE:
                                    console.error("Game mode API Failed - Error"), console.error(t), this.alertUtil.hideModalLoader();
                                    break;
                                case r.eX.SET_GAME_MODE:
                                    this.alertUtil.hideModalLoader(), console.error("Game mode SET API Failed - Error"), console.error(t)
                            }
                        }
                        get enable() {
                            return this.gameModeForm.get("enable")
                        }
                    }
                    return i.\u0275fac = function(t) {
                        return new(t || i)(e.Y36(M.r), e.Y36(C.o), e.Y36(m.s), e.Y36(E.gT), e.Y36(l.Lw))
                    }, i.\u0275cmp = e.Xpm({
                        type: i,
                        selectors: [
                            ["app-game-mode"]
                        ],
                        decls: 3,
                        vars: 2,
                        consts: [
                            [1, "flex-column", "grid-gap-24", "password"],
                            [3, "formGroup"],
                            ["mb-20", "", 4, "ngIf"],
                            ["mb-20", ""],
                            ["labelAlign", "top", 3, "rowLayout"],
                            ["mt-2", "", 3, "title"],
                            [1, "password__form-control"],
                            ["formControlName", "enable", 3, "isChecked", "change"]
                        ],
                        template: function(t, s) {
                            1 & t && (e.TgZ(0, "div", 0)(1, "form", 1), e.YNc(2, ot, 7, 3, "pv-card", 2), e.qZA()()), 2 & t && (e.xp6(1), e.Q6J("formGroup", s.gameModeForm), e.xp6(1), e.Q6J("ngIf", s.api.device_capability.getVal("maintenance", "gameMode", "visibility").isOn))
                        },
                        dependencies: [f.O5, d._Y, d.JJ, d.JL, l.J8, l.$t, l.fC, l.tB, d.sg, d.u]
                    }), i
                })()
            }, {
                path: "loid",
                component: Re
            }, {
                path: "slid",
                component: Fe
            }, {
                path: "backup-restore",
                component: Te
            }, {
                path: "firmware-upgrade",
                component: Q
            }, {
                path: "diagnostics",
                component: oe
            }, {
                path: "log",
                component: fe
            }, {
                path: "deltaCfgTool",
                component: st
            }, {
                path: "container-management",
                component: nt
            }];
            let lt = (() => {
                    class i {}
                    return i.\u0275fac = function(t) {
                        return new(t || i)
                    }, i.\u0275mod = e.oAB({
                        type: i
                    }), i.\u0275inj = e.cJS({
                        imports: [L.Bz.forChild(rt), L.Bz]
                    }), i
                })(),
                ct = (() => {
                    class i {}
                    return i.\u0275fac = function(t) {
                        return new(t || i)
                    }, i.\u0275mod = e.oAB({
                        type: i
                    }), i.\u0275inj = e.cJS({
                        imports: [O.m, lt]
                    }), i
                })()
        },
        3199: (G, D, h) => {
            h.d(D, {
                r: () => r
            });
            var O = h(8256),
                L = h(7556);
            let r = (() => {
                class I {
                    constructor(m) {
                        this.authService = m
                    }
                    get isAdminUser() {
                        return !0
                    }
                    accessConfig() {
                        return console.log(1), {
                            overview: {
                                pageVisibility: 1
                            },
                            status: {
                                deviceInformation: 1,
                                lanStatus: 1,
                                wanStatus: 1,
                                wanStatusIpv6: 1,
                                staInformation: 1,
                                neighboringAp: 1,
                                homeNetworking: 1,
                                opticsModulesStatus: 1,
                                statistics: 1,
                                voiceInformation: 1
                            },
                            network: {
                                lan: {
                                    pageVisibility: 1,
                                    fields: {
                                        portMode: 1,
                                        allPortToBridgeMode: 1,
                                        port1: 1,
                                        port2: 1,
                                        port3: 1,
                                        port4: 1,
                                        port5: 1,
                                        saveButton: 1,
                                        refresh: 1,
                                        staticDHCPEntry: 1,
                                        macAddress: 1,
                                        ipv4Address: 1,
                                        delete: 1
                                    }
                                },
                                wan: {
                                    pageVisibility: 1,
                                    fields: {
                                        wanConnection: 1,
                                        connectionType: 1,
                                        connectionMode: 1,
                                        ipMode: 1,
                                        enableDisable: 1,
                                        nat: 1,
                                        service: 1,
                                        lanPortBinding: 1,
                                        ssidPortBinding: 1,
                                        PvidLanPortBinding: 1,
                                        PvidSsidPortBinding: 1,
                                        addressMethod: 1,
                                        enablePrefixDelegation: 1,
                                        enableVLan: 1,
                                        vLanId: 1,
                                        vLanPri: 1,
                                        wanIpMode: 1,
                                        manualDNS: 1,
                                        priDns: 1,
                                        secDns: 1,
                                        prefixType: 1,
                                        saveBtn: 1,
                                        deleteBtn: 1,
                                        aftrMode: 1,
                                        aftrAddress: 1,
                                        accessType: 1,
                                        enableDHCP: 1,
                                        customPriDNS: 1,
                                        customSecDNS: 1,
                                        connMode: 1,
                                        voip: 1,
                                        VlanMode: 1
                                    }
                                },
                                wan_dhcp: {
                                    pageVisibility: 1,
                                    fields: {
                                        wanList: 1,
                                        option50: 1,
                                        option60: 1,
                                        option61: 1,
                                        option77: 1,
                                        option90: 1,
                                        identifier60: 1,
                                        identifier61: 1,
                                        authenticationinfo: 1,
                                        userclassinfo: 1
                                    }
                                },
                                lanipv6: {
                                    pageVisibility: 1,
                                    fields: {
                                        dnsServer: 1,
                                        preferredDNS: 1,
                                        alternativeDNS: 1,
                                        prefixConfig: 1,
                                        dhcpStartIP: 1,
                                        dhcpEndIP: 1,
                                        minimuminterval: 1,
                                        maximuminterval: 1,
                                        checkAddressInfo: 1,
                                        checkOtherInfo: 1,
                                        prefixInterface: 1,
                                        dnsInterface: 1,
                                        prefixText: 1
                                    }
                                },
                                wireless2_4: {
                                    pageVisibility: 1,
                                    fields: {
                                        totalmaxusers: 1,
                                        maxusers: 1,
                                        ssidselect: 1,
                                        ssidname: 1,
                                        wepencryptionmode: 1,
                                        encryptionmode: 1,
                                        encryptionlevel: 1,
                                        wpsmode: 1,
                                        enablewps: 1,
                                        wpashowpwd: 1,
                                        wepshowpwd: 1,
                                        wpaencryptionmode: 1,
                                        wpaversion: 1,
                                        servertimeinterval: 1,
                                        accountingserverport: 1,
                                        accountingserverkey: 1,
                                        secondarypwd: 1,
                                        secondaryport: 1,
                                        secondaryserver: 1,
                                        primarypwd: 1,
                                        primaryport: 1,
                                        enablemumimo: 1,
                                        primaryserver: 1,
                                        portmode: 1,
                                        broadcast: 1,
                                        enablessid: 1,
                                        wmm: 1,
                                        power: 1,
                                        channel: 1,
                                        bandwidth: 1,
                                        mode: 1,
                                        wepkeypwd: 1,
                                        wpakey: 1,
                                        enableWirelessCheckbox: 1,
                                        pincode: 1,
                                        isolation: 1,
                                        guestmode: 1,
                                        domainGrouping: 1,
                                        chooseDomainName: 1,
                                        createNewDomain: 1,
                                        domainName: 1,
                                        WanInterface: 1,
                                        numOfIp: 1,
                                        lan1: 1,
                                        lan2: 1,
                                        lan3: 1,
                                        lan4: 1,
                                        lan5: 1
                                    }
                                }
                            },
                            security: {
                                firewall: {},
                                macFilter: {},
                                ipFilter: {
                                    enableIpFilter: 1,
                                    internalClient: 1,
                                    localIpAddress: 1,
                                    sourceSubnetMask: 1,
                                    remoteIpAddress: 1,
                                    destSubnetMask: 1,
                                    protocol: 1,
                                    srcStartPort: 1,
                                    srcEndPort: 1,
                                    destStartPort: 1,
                                    destEndPort: 1
                                },
                                urlFilter: {},
                                parentalControl: {},
                                dmgAndAlg: {},
                                accessControl: {}
                            },
                            maintenance: {
                                pasword: {},
                                speedTest: {},
                                speedTestHistory: {},
                                loidAuthentication: {},
                                deviceManagement: {},
                                backupAndRestore: {},
                                firewareUpgrade: {},
                                rebootDevice: {},
                                factoryDefault: {},
                                diagonostics: {},
                                log: {}
                            },
                            application: {
                                portForwarding: {},
                                portTriggering: {},
                                ddns: {},
                                ntp: {},
                                usb: {},
                                upnaAndDlna: {},
                                voiceSetting: {}
                            }
                        }
                    }
                }
                return I.\u0275fac = function(m) {
                    return new(m || I)(O.LFG(L.e))
                }, I.\u0275prov = O.Yz7({
                    token: I,
                    factory: I.\u0275fac,
                    providedIn: "root"
                }), I
            })()
        }
    }
]);