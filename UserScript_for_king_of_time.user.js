// ==UserScript==
// @name         UserScript_for_king_of_time
// @namespace    http://your.homepage/
// @version      0.1
// @description  enter something useful
// @author       daisuke.fuchise
// @match        http://tampermonkey.net/scripts.php
// @grant        none
// ==/UserScript==




$(function() {
    // jQuery v2系をインクルード
    $('head').append('<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>');
    var schedule_pattern = '常駐';
    var sStorage = sessionStorage;
    var viewStatus = false;
    // CSSを定義
    var css = {
        '#my_dialog *': {
            'margin': 0,
            'padding': 0,
            'font-family': 'メイリオ'
        },
        '#my_dialog': {
            'background': 'white',
            'position': 'fixed',
            'top': 0,
            'left': 0,
            'border': '1px solid silver',
            'box-shadow': '5px 5px 5px 5px gray',
            'text-align': 'center',
            'border-radius': '0.5em'
        },
        '#my_dialog h2': {
            'font-size': '0.8em',
            'font-weight': 'bold',
            'background': 'navy',
            'color': 'white',
            'padding': '0.5em',
        },
        '#my_dialog button': {
            'background': 'white',
            'border': '1px solid silver outset'
        },
        '#my_dialog_input_area': {
            'margin': '0.5em'
        },
        '#my_dialog_button_area': {
            'margin': '0 0 0.5em 0'
        },
        '#my_dialog_input_area input': {
            'width': '50px',
            'background': 'white',
            'border': '1px solid silver inset'
        },
        '#my_dialog_input_area input[type=number]': {
            'text-aligin': 'right'
        },
        '#my_dialog_input_area label': {
            'display': 'block',
            'padding': '0.2em 1em',
            'background': 'white',
            'border': 'none'
        },
        '#my_dialog_button_area button': {
            'padding': '0.5em'
        },
        '#my_dialog_close': {
            'position': 'absolute',
            'top': 5,
            'right': 3,
            'padding': '0 3px',
            'background': 'none',
            'color': 'white',
            'border': 'none'
        }
    };

    // ----HTML定義
    // 入力補助ツール表示ボタンの生成
    $('#menu_container').append('<button id="my_view_button">入力補助表示</button>');
    // 入力補助ツール表示ボタンの動作
    $(document).find('#my_view_button').click(function(e) {
        $myDialog.self.toggle();
    });


    // 入力補助ツールダイアログ生成
    $('body').append('<div id="my_dialog"></div>');
    var $myDialog = {
        self: $(document).find('#my_dialog')
    };
    $myDialog.self
    .append('<h2>入力補助ダイアログ</h2>')
    .append('<div id="my_dialog_input_area"></div>')
    .append('<div id="my_dialog_button_area"></div>')
    .append('<button id="my_dialog_close" title="閉じる">×</button>')
    ;

    $myDialog.inputArea = $myDialog.self.find('#my_dialog_input_area');
    $myDialog.inputArea
    .append('<label>スケジュールパターン <select id="my_dialog_schedule_pattern"><option value="常駐" selected>常駐</option></select></label>')
    .append('<label>出勤予定 <input type="number" id="my_start_time_hour"></input>：<input type="number" id="my_start_time_minute"></input></label>')
    .append('<label>退勤予定 <input type="number" id="my_end_time_hour"></input>：<input type="number" id="my_end_time_minute"></input></label>')
    .append('<label>休憩予定時間 <input type="number" id="my_rest_time"></input>分</label>')
    .append('<label><input type="checkbox" id="my_dialog_anytime_show" value="false"></input>画面遷移時に表示する</label>')
    .append('<label><input type="checkbox" id="my_dialog_auto_input" value="false"></input>画面遷移時に自動入力する</label>')
    ;

    $myDialog.self.find('#my_dialog_button_area')
    .append('<button id="my_save_button">入力を保存</button>')
    .append('<button id="my_schedule_enter_button">スケジュール入力</button>')
    ;

    // -----初期化
    // セッションストレージから値を取得
    $myDialog.self.find('input').each(function() {
        var value = sStorage.getItem($(this).attr('id'), $(this).val());
        $(this).val(value);
    });
    // セッションストレージに値を保存
    $myDialog.self.find('#my_save_button').click(function() {
        $myDialog.self.find('#my_dialog_input_area input').each(function() {
            sStorage.setItem($(this).attr('id'), $(this).val());
        });
    });

    // -----イベント登録
    // チェックボックスの動作
    $myDialog.self.find('input[type=checkbox]').click(function() {
        $(this).val($(this).prop('checked'));
    });

    // 入力補助ツールの閉じるボタン動作
    $myDialog.self.find('#my_dialog_close').click(function() {
        $myDialog.self.hide();
    });

    // 入力補助ツールダイアログボタン動作
    $myDialog.self.find('#my_schedule_enter_button').click(function() {
        $('#select_schedule_pattern_id > option').each(function() {
            if($(this).text() === schedule_pattern) {
                $(this).attr('selected', true);
            } else {
                $(this).attr('selected', false);
            }
        });
        var startTimeHour = $('#my_start_time_hour').val();
        var startTimeMinute = $('#my_start_time_minute').val();
        var endTimeHour = $('#my_end_time_hour').val();
        var endTimeMinute = $('#my_end_time_minute').val();
        var restTime = $('#my_rest_time').val();
        $('#schedule_start_time_hour').val(startTimeHour);
        $('#schedule_start_time_minute').val(startTimeMinute);
        $('#schedule_end_time_hour').val(endTimeHour);
        $('#schedule_end_time_minute').val(endTimeMinute);
        $('#schedule_break_minute').val(restTime);
    });

    //-----終了処理
    // 常に表示ボタンのチェック状態を反映
    $myDialog.anyTimeShow = $myDialog.self.find('#my_dialog_anytime_show')
    if ($myDialog.anyTimeShow.val() === 'true') {
        $myDialog.anyTimeShow.prop('checked', true);
        $myDialog.self.show();
    } else {
        $myDialog.anyTimeShow.prop('checked', false);
        $myDialog.self.hide()
    }
    // 画面繊維時に自動入力するボタンの動作
    $myDialog.autoInput = $myDialog.self.find('#my_dialog_auto_input');
    if ($myDialog.autoInput.val() === 'true') {
        $myDialog.autoInput.prop('checked', true);
        $myDialog.self.find('#my_schedule_enter_button').click();
    } else {
        $myDialog.autoInput.prop('checked', false);
    }

    // CSSを適用する
    applyCSS(css);
    function applyCSS(css) {
        for (var selector in css) {
            var $selector = $(selector);
            for (var propety in css[selector]) {
                $selector.css(propety, css[selector][propety]);
            }
        }
    }
});