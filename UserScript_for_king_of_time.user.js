// ==UserScript==
// @name         UserScript_for_king_of_time
// @namespace    https://raw.githubusercontent.com/vicboss1002/kot_ui/master/UserScript_for_king_of_time.user.js
// @version      4.0.0
// @updateURL    https://raw.githubusercontent.com/vicboss1002/kot_ui/master/UserScript_for_king_of_time.user.js
// @downloadURL  https://raw.githubusercontent.com/vicboss1002/kot_ui/master/UserScript_for_king_of_time.user.js
// @supportURL   https://github.com/vicboss1002/kot_ui/issues
// @description  This script will be running on the site of "King of Time". This will help you to input schedule pattern monthly.
// @author       daisuke.f
// @include      https://s3.kingtime.jp/admin/*
// @exclude      https://s3.kingtime.jp/admin/
// @exclude      https://s3.kingtime.jp/admin/*?page_id=/employee/request_list*
// @exclude      https://s3.kingtime.jp/admin/*?page_id=/employee/change_password*
// @exclude      https://s3.kingtime.jp/admin/*?page_id=/schedule/schedule_pattern_list_for_employee*
// @require      https://code.jquery.com/jquery-3.1.1.slim.min.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==


// 以下の処理の流れを変更すると動作しなくなる可能性があります。
// 　1.定義
// 　2.初期処理
// 　3.イベント登録
// 　4.終了処理
$(document).ready(function () {
    // -----定義
    var targets = {
        'select_schedule_pattern_id': 'スケジュールパターン',
        'schedule_start_time_hour': '出勤予定（時）',
        'schedule_start_time_minute': '出勤予定（分）',
        'schedule_end_time_hour': '退勤予定（時）',
        'schedule_end_time_minute': '退勤予定（分）',
        'schedule_break_minute': '休憩予定時間'
    };
    // ----HTML定義
    // ヒアドキュメントを生成
    var hereDocumentBuilder = {
        build: function (name) {
            var target = this.documents[name];
            return target ? target.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1] : "";
        },
        documents: {
            defineListFormat: function() {/*
                <tr>
                    <th>${label}</th>
                    <td>${id}</td>
                </tr>
            */},
            // 拡張ツールボックスのボタンのタグ
            viewButton: function () {/*
                <button id="extended_tool_box_settings_toggle">拡張<br />ツールボックス<br />表示</button>
            */},
            // 拡張ツールボックスのタグ
            extendedToolBox: function () {/*
                <div id="extended_tool_box_wrapper">
                    <section id="extended_tool_box">
                        <header>
                            <h1>拡張ツールボックス</h1>
                        </header>
                        <div id="extended_tool_box_content">
                            <h2>設定</h2>
                            <form id="extended_tool_box_content_form">
                                <div id="extended_tool_box_checkbox_area">
                                    <input type="checkbox" id="extended_tool_box_always_showing" />
                                    <label for="extended_tool_box_always_showing" title="設定画面を常に開いた状態にします。" class="check_css">常に設定を開く</label>
                                    <input type="checkbox" id="extended_tool_box_input_value_saving" checked />
                                    <label for="extended_tool_box_input_value_saving" title="入力値を保存します。" class="check_css">入力ボックスの状態を記憶</label>
                                    <input type="checkbox" id="extended_tool_box_auto_restoration" checked />
                                    <label for="extended_tool_box_auto_restoration" title="記憶した入力ボックスの状態を自動復元します。" class="check_css">記憶した入力ボックスの状態を復元</label>
                                </div><!-- #extended_tool_box_checkbox_area -->
                                <div id="extended_tool_box_button_area">
                                    <button type="button" id="extended_tool_box_input_value_clear" class="btn">記憶した入力ボックスの状態をクリアする</button>
                                </div><!-- #extended_tool_box_button_area -->
                            </form>
                            <h2記憶する入力ボックス</h2>
                            <table id="extended_tool_box_targets" class="type04">
                                <!-- 入力値記憶対象を表示 -->
                            </table><!-- extended_tool_box_targets -->
                        </div><!-- #extended_tool_box_content -->
                    </section><!-- #extended_tool_box -->
                </div>
            */},
            // CSSのタグ
            style: function () {/*
                <style id="extended_tool_box_styles">
                    #extended_tool_box_wrapper * {
                        margin: 0;
                        padding: 0;
                        font-family: メイリオ;
                        vertical-align: middle
                        text-decoration: none;
                        font-size: 10pt;
                        line-height: 1.5;
                    }
                    #extended_tool_box_wrapper {
                        width: 300px;
                        margin-right: 1em;
                    }
                    #extended_tool_box {
                        color: #666;
                        background: white;
                        padding: 1em;
                        position: fixed;
                        top: 0;
                        width: 300px;
                        box-shadow: 5px 0px 5px 2px silver;
                        z-index: 9999;
                        height: 100%;
                    }
                    #extended_tool_box_settings_toggle {
                        font-size: 0.2em;
                        background-color: DarkBlue;
                        color: white;
                        border-radius: 50% 50%;
                        box-shadow: 2px 2px 4px 2px silver;
                        padding: 1em;
                        font-family: メイリオ;
                        transition: 0.1s;
                    }
                    #extended_tool_box_settings_toggle:hover {
                        background-color: gray;
                        transform: rotate(20deg);
                    }
                    #extended_tool_box h1,#extended_tool_box h2 {
                        margin-bottom: 1em;
                    }
                    #extended_tool_box input, #extended_tool_box select {
                        background: white;
                        border: inset 1px silver;
                        margin: 0.1em
                    }
                    #extended_tool_box_header {
                        text-align: center;
                        font-size: 0.8em;
                        font-weight: bold;
                        background: navy;
                        color: white;
                        padding: 0.5em;
                    }
                    #extended_tool_box_content {
                        margin: 0.5em
                    }
                    .my_dialog_labels, .my_dialog_inputs {
                        width: 150px;
                        padding: 0 5px;
                        float: left;
                        white-space: nowrap
                    }
                    .my_dialog_labels {
                        text-align: center;
                    }
                    #extended_tool_box_button_area {
                        margin: 0 0 0.5em 0;
                        text-align: center
                    }
                    #extended_tool_box input:not([type=checkbox]) {
                        width: 50px
                    }
                    #extended_tool_box_input_area input[type=number] {
                        text-aligin: right
                    }
                    #extended_tool_box label {
                        background: white;
                        display: block;
                        border: none;
                    }
                    #extended_tool_box_input_area > div {
                        margin-bottom: 2em;
                    }
                    #extended_tool_box_input_area label {
                        border-bottom: 1px solid gray;
                        margin-bottom: 0.5em;                        
                    }
                    #extended_tool_box_close {
                        position: absolute;
                        top: 2px;
                        right: 3px;
                        padding: 0 3px;
                        background: none;
                        color: white;
                        border: none
                    }
                    #extended_tool_box_input_area, 
                    #extended_tool_box_button_area {
                        margin-bottom: 1em;
                    }
                    #extended_tool_box_content_form > div {
                        margin-bottom: 2em;
                    }

                    input[type=checkbox] {
                        display: none;
                    }
                    #extended_tool_box .check_css {
                        -webkit-transition: background-color 0.2s linear;
                        transition: background-color 0.2s linear;
                        position: relative;
                        display: inline-block;
                        padding: 0 0 0 42px;
                        vertical-align: middle;
                        cursor: pointer;
                    }
                    #extended_tool_box .check_css:hover:after {
                        border-color: #0171bd;
                    }
                    #extended_tool_box .check_css:after {
                        -webkit-transition: border-color 0.2s linear;
                        transition: border-color 0.2s linear;
                        position: absolute;
                        top: 50%;
                        left: 15px;
                        display: block;
                        margin-top: -10px;
                        width: 16px;
                        height: 16px;
                        border: 2px solid #ccc;
                        border-radius: 6px;
                        content: '';
                    }
                    #extended_tool_box .check_css:before {
                        -webkit-transition: opacity 0.2s linear;
                        transition: opacity 0.2s linear;
                        position: absolute;
                        top: 50%;
                        left: 21px;
                        display: block;
                        margin-top: -7px;
                        width: 5px;
                        height: 9px;
                        border-right: 3px solid #0171bd;
                        border-bottom: 3px solid #0171bd;
                        content: '';
                        opacity: 0;
                        -webkit-transform: rotate(45deg);
                        -ms-transform: rotate(45deg);
                        transform: rotate(45deg);
                    }
                    #extended_tool_box input[type=checkbox]:checked + .check_css:before {
                        opacity: 1;
                    }
 
                    #extended_tool_box table.type04 {
                        border-collapse: separate;
                        border-spacing: 1px;
                        text-align: left;
                        line-height: 1.5;
                        border-top: 1px solid #ccc;
                        width: 100%;
                    }
                    #extended_tool_box table.type04 th {
                        font-size: 0.5em;
                        padding: 10px;
                        font-weight: bold;
                        vertical-align: top;
                        border-bottom: 1px solid #ccc;
                    }
                    #extended_tool_box table.type04 td {
                        font-size: 0.5em;
                        padding: 10px;
                        vertical-align: top;
                        border-bottom: 1px solid #ccc;
                    }
                    #extended_tool_box .btn {
                        background: #09C;
                        border: 1px solid #DDD;
                        color: #FFF;
                        text-shadow: 0px 1px 1px rgba(255,255,255,0.85),0px 0px 5px rgba(0,0,0,1);
                        width: 100%;
                        padding: 10px 0;
                    }
                </style>
            */}
        }
    };

    // CSSを定義
    $('head').append(hereDocumentBuilder.build('style'));

    // 拡張ツールボックスボタンを生成
    $('#menu_container').append(hereDocumentBuilder.build('viewButton'));
    // 拡張ツールボックスの定義
    $('body > table > tbody > tr').prepend(hereDocumentBuilder.build('extendedToolBox'));
    // 拡張ツールボックスのクローンオブジェクト
    var $extendedToolBox = {
        self: $(document).find('#extended_tool_box'),
        wrapper: $(document).find('#extended_tool_box_wrapper'),
        content: {
            self: $(document).find('#extended_tool_box_content'),
            targets: $(document).find('#extended_tool_box_targets'),
            form: $(document).find('#extended_tool_box_content_form'),
            inputArea: $(document).find('#extended_tool_box_input_area'),
            checkboxArea: $(document).find('#extended_tool_box_checkbox_area'),
            buttonArea: $(document).find('#extended_tool_box_button_area'),
        },
        alwaysShowing: $(document).find('#extended_tool_box_always_showing'),
        autoRestoration: $(document).find('#extended_tool_box_auto_restoration'),
        inputValueSaving: $(document).find('#extended_tool_box_input_value_saving'),
        inputValueClear: $(document).find('#extended_tool_box_input_value_clear')
    };

    // -----初期化
    // 復元対象の入力ボックスをテーブル表示
    var targetsTableItems = '';
    Object.keys(targets).forEach(function(e) {
        targetsTableItems += hereDocumentBuilder.build('defineListFormat').replace('${label}', targets[e]).replace('${id}', e);
    });
    $extendedToolBox.content.targets.append(targetsTableItems);
    // 設定の初期化
    // (チェックボックス and ラジオボタン)の場合
    $extendedToolBox.self.find(':input[type=checkbox], :input[type=radio]').each(function(e) {
        var $in = $(this);
        var checked = localStorage.getItem($in.prop('id'));
        // 設定値が
        if (checked !== null) {
            $in.prop('checked', (checked === 'true'));
        }
    });
    // 設定値の保存
    // (チェックボックス and ラジオボタン)の場合
    $extendedToolBox.self.find(':input[type=checkbox], :input[type=radio]').on('change', function(e) {
        var $in = $(this);
        localStorage.setItem($in.prop('id'), $in.prop('checked'));
    });

    // 入力ボックスを初期化
    $(document).find(':input').each(function (e) {
        var $in = $(this);
        // 入力ボックスを復元するがチェック状態の場合
        if ($extendedToolBox.autoRestoration.prop('checked') && Object.keys(targets).indexOf($in.prop('id')) !== -1) {
            // 入力ボックスの状態を復元する
            var val = sessionStorage.getItem($in.prop('id'));
            $in.val(val);
        }
    });
    // (チェックボックス and ラジオボタン）の場合
    // $(document).on('change', ':input[type=checkbox], :input[type=radio]', function(e) {
    //     var $in = $(this);
    //     if (Object.keys(targets).indexOf($in.prop('id')) === -1) return;
    //     sessionStorage.setItem($in.prop('id'), $in.prop('checked'));
    // });
    // (チェックボックス and ラジオボタン)以外の場合
    $(document).on('change', ':input:not([type=checkbox], [type=radio])', function (e) {
        var $in = $(this);
        //if (/extended_tool_box.*/.test($in.prop('id'))) return; // 拡張ツールボックス内の入力ボックスは除外
        var targetKeys = Object.keys(targets);
        if ($extendedToolBox.inputValueSaving.prop('checked') && targetKeys.indexOf($in.prop('id')) !== -1) {
            targetKeys.forEach(function(e) {
                sessionStorage.setItem(e, $('#' + e).val()); // セッションストレージに値を保存する
            });
        }
    });



    // -----イベントハンドラを登録
    // [拡張ツールボックス表示]ボタンのクリック処理
    $(document).on('click', '#extended_tool_box_settings_toggle', function (e) {
        if ($extendedToolBox.wrapper.is(':hidden')) {
            $extendedToolBox.wrapper.show(200);
        } else {
            $extendedToolBox.wrapper.hide(100);
        }
    });

    // [リセット]ボタン
    $extendedToolBox.inputValueClear.on('click', function (e) {
        sessionStorage.clear();
        alert('記憶した入力ボックスの状態をクリアしました。');
    });

    //-----終了処理
    // ダイアログ内の送信処理は中断
    $extendedToolBox.self.find('form').submit(function (e) {
        return confirm('拡張ツールボックス内で送信処理が検出されました。\n続行しますか？');
    });

    // 画面遷移時に表示するチェック時の動作
    if ($extendedToolBox.alwaysShowing.prop('checked')) {
        $extendedToolBox.wrapper.show();
    } else {
        $extendedToolBox.wrapper.hide();
    }

});