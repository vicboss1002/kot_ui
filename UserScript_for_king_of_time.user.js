// ==UserScript==
// @name         UserScript_for_king_of_time
// @namespace    https://raw.githubusercontent.com/vicboss1002/kot_ui/master/UserScript_for_king_of_time.user.js
// @version      3.0.1
// @updateURL    https://raw.githubusercontent.com/vicboss1002/kot_ui/master/UserScript_for_king_of_time.user.js
// @downloadURL  https://raw.githubusercontent.com/vicboss1002/kot_ui/master/UserScript_for_king_of_time.user.js
// @supportURL   https://github.com/vicboss1002/kot_ui/issues
// @description  This script will be running on the site of "King of Time".
// @author       daisuke.f
// @include      https://s3.kingtime.jp/admin/*
// @exclude      https://s3.kingtime.jp/admin/
// @exclude      https://s3.kingtime.jp/admin/*?page_id=/employee/request_list*
// @exclude      https://s3.kingtime.jp/admin/*?page_id=/employee/change_password*
// @exclude      https://s3.kingtime.jp/admin/*?page_id=/schedule/schedule_pattern_list_for_employee*
// @required     https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==


// 以下の処理の流れを変更すると動作しなくなる可能性があります。
// 　1.定義
// 　2.初期処理
// 　3.イベント登録
// 　4.終了処理
$(document).ready(function() {
    // -----定義
    // ----HTML定義

    // ヒアドキュメントを生成
    var hereDocumentBuilder = {
        build: function(name) {
            var target = this.documents[name];
            return target? target.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1]: "";
        },
        documents: {
            // 拡張ツールボックスのボタンのタグ
            viewButton: function() {/*
                <button id="my_view_button">拡張<br />ツールボックス<br />表示</button>
            */},
            // 拡張ツールボックスのタグ
            extendedToolBox: function() {/*
                <div id="extended_tool_box_wrapper">
                    <div id="extended_tool_box">
                        <div id="extended_tool_box_content">
                            <form id="extended_tool_box_content_form">
                                <div id="extended_tool_box_input_area">
                                    <div>
                                        <label for="extended_tool_box_schedule_pattern" class="extended_tool_box_labels">スケジュールパターン</label>
                                        <div class="extended_tool_box_inputs">
                                            <select id="extended_tool_box_schedule_pattern">
                                                <option value="常駐">常駐</option>
                                                <option value="休出">休出</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label for="my_start_time_hour my_start_time_minute" class="extended_tool_box_labels">出勤予定</label>
                                        <div class="extended_tool_box_inputs">
                                            <input type="number" id="my_start_time_hour" />時<input type="number" id="my_start_time_minute" />分
                                        </div>
                                    </div>
                                    <div>
                                        <label for="my_end_time_hour my_end_time_minute" class="extended_tool_box_labels">退勤予定</label>
                                        <div  class="extended_tool_box_inputs">
                                            <input type="number" id="my_end_time_hour" />時<input type="number" id="my_end_time_minute" />分
                                        </div>
                                    </div>
                                    <div>
                                        <label for="my_rest_time" class="extended_tool_box_labels">休憩予定時間</label>
                                        <div class="extended_tool_box_inputs">
                                            <input type="number" id="my_rest_time">分
                                        </div>
                                    </div>
                                </div><!-- #extended_tool_box_input_area -->
                                <div id="extended_tool_box_checkbox_area">
                                    <div class="extended_tool_box_checkboxes">
                                        <label for="extended_tool_box_anytime_show" title="この拡張ツールボックスを常に表示状態とします。">
                                            <input type="checkbox" id="extended_tool_box_anytime_show" value="false" />常に表示する
                                        </label>
                                    </div>
                                    <div class="extended_tool_box_checkboxes">
                                        <label for="extended_tool_box_auto_input" title="スケジュール申請画面が入力値と同期されます。">
                                            <input type="checkbox" id="extended_tool_box_auto_input" value="false" />スケジュール入力値を同期する
                                        </label>
                                    </div>
                                </div><!-- #extended_tool_box_checkbox_area -->
                                <div id="extended_tool_box_button_area">
                                    <button type="reset">リセット</button>
                                    <button type="button" id="my_schedule_enter_button">スケジュール入力</button>
                                </div><!-- #extended_tool_box_button_area -->
                            </form>
                        </div><!-- #extended_tool_box_content -->
                    </div><!-- #extended_tool_box -->
                </div>
            */},
            // CSSのタグ
            style: function() {/*
                <style id="my_dialog_style">
                    #extended_tool_box_wrapper * {
                        margin: 0;
                        padding: 0;
                        font-family: メイリオ;
                        vertical-align: middle
                        text-decoration: none;
                        font-size: 9pt;
                    }
                    #extended_tool_box_wrapper {
                        background: white;
                        width: 300px;
                        margin-right: 1em;
                    }
                    #extended_tool_box {
                      padding-right: 1em;
                      position: fixed;
                      top: 0;
                      width: 300px;
                      box-shadow: 5px 0px 5px 2px silver;
                      z-index: 9999;
                      height: 100%;
                    }

                    #my_view_button {
                        font-size: 0.2em;
                        background-color: DarkBlue;
                        color: white;
                        border-radius: 50% 50%;
                        box-shadow: 2px 2px 4px 2px silver;
                        padding: 1em;
                        font-family: メイリオ;
                        transition: 0.1s;
                    }
                    #my_view_button:hover {
                        background-color: gray;
                        transform: rotate(20deg);
                    }
                    #extended_tool_box h2 {
                        font-size: 1em
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
                    .my_dialog_checkboxes {
                        vertical-align: middle
                    }
                    #extended_tool_box_checkbox_area {
                        padding: 0 2%;
                        clear: both
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
                    #extended_tool_box_input_area div {
                        margin-bottom: 0.5em;
                    }
                    #extended_tool_box_input_area label {
                        border-bottom: 1px solid gray;
                        margin-bottom: 0.5em;                        
                    }
                    #extended_tool_box button {
                        padding: 0.5em 2em;
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
                    #extended_tool_box_checkbox_area,
                    #extended_tool_box_button_area {
                        margin-bottom: 1em;
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
    var $extentedToolBox = {
        self: $(document).find('#extended_tool_box'),
        wrapper: $(document).find('#extended_tool_box_wrapper'),
        content: {
            self: $(document).find('#extended_tool_box_content'),
            form: $(document).find('#extended_tool_box_content_form'),
            inputArea: $(document).find('#extended_tool_box_input_area'),
            checkboxArea: $(document).find('#extended_tool_box_checkbox_area'),
            buttonArea: $(document).find('#extended_tool_box_button_area'),
        },
        anyTimeShow: $(document).find('#extended_tool_box_anytime_show'),
        autoInput: $(document).find('#extended_tool_box_auto_input'),
        schedulePattern: $(document).find('#extended_tool_box_schedule_pattern')
    };

    // -----初期化
    // セッションストレージから値を読み取る
    $extentedToolBox.self.find(':input').each(function(e) {
        var value = sessionStorage.getItem($(this).attr('id'), $(this).val());
        $(this).val(value);
    });

    // -----イベントハンドラを登録
    // [拡張ツールボックス表示]ボタンのクリック処理
    $(document).find('#my_view_button').click(function(e) {
        if ($extentedToolBox.wrapper.is(':hidden')) {
            $extentedToolBox.wrapper.show(200);
        } else {
            $extentedToolBox.wrapper.hide(100);
        }
    });

    // <input>タグの値変更時の処理
    // セッションストレージに値を保存
    $extentedToolBox.self.find(':input').live('change', function(e) {
        if (!$(this).prop('id')) return false;
        sessionStorage.setItem($(this).attr('id'), $(this).val()); // セッションストレージに値を保存する
    });
    // [リセット]ボタン
    $extentedToolBox.self.find(':input[type=reset]').live('click', function(e) {
        sessionStorage.clear();
    });

    // チェックボックスをクリック時の処理
    $extentedToolBox.self.find('input[type=checkbox]').click(function() {
        $(this).val($(this).prop('checked'));
    });

    // [スケジュール入力]ボタン動作
    $extentedToolBox.content.buttonArea.find('#my_schedule_enter_button').click(function() {
        // スケジュール申請ページの判定
        // 入力対象が見つからなければ処理をスキップする
        if ($('#select_schedule_pattern_id').size() !== 1) return false;
        //var schedule_pattern = $('#my_dialog_schedule_pattern').val();
        $('#select_schedule_pattern_id > option').each(function(e) {
            if($(this).text() === $extentedToolBox.schedulePattern.val()) {
                $(this).attr('selected', true);
            } else {
                $(this).attr('selected', false);
            }
        });
        var startTimeHour = $('#my_start_time_hour').val(), startTimeMinute = $('#my_start_time_minute').val();
        var endTimeHour = $('#my_end_time_hour').val(), endTimeMinute = $('#my_end_time_minute').val();
        var restTime = $('#my_rest_time').val();
        $('#schedule_start_time_hour').val(startTimeHour);
        $('#schedule_start_time_minute').val(startTimeMinute);
        $('#schedule_end_time_hour').val(endTimeHour);
        $('#schedule_end_time_minute').val(endTimeMinute);
        $('#schedule_break_minute').val(restTime);
    });


    //-----終了処理
    // ダイアログ内の送信処理は中断
    $extentedToolBox.self.find('form').submit(function(e) {
        return confirm('拡張ダイアログ内で送信処理が検出されました。\n続行しますか？');
    });
    // チェックボックスの状態反映
    $extentedToolBox.self.find('input[type=checkbox]').each(function(e) {
        var checked = $(this).val().toLowerCase() === 'true';
        $(this).prop('checked', checked);
    });

    // 画面遷移時に表示するチェック時の動作
    if ($extentedToolBox.anyTimeShow.prop('checked')) {
        $extentedToolBox.wrapper.show();
    } else {
        $extentedToolBox.wrapper.hide();
    }

    // スケジュール入力値を同期するチェック時の動作
    if ($extentedToolBox.autoInput.val() === 'true') {
        $extentedToolBox.self.find('#my_schedule_enter_button').click();
    }

});