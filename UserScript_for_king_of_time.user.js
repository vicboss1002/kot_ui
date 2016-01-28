// ==UserScript==
// @name         UserScript_for_king_of_time
// @namespace    https://raw.githubusercontent.com/vicboss1002/kot_ui/master/UserScript_for_king_of_time.user.js
// @version      1.4
// @updateURL    https://raw.githubusercontent.com/vicboss1002/kot_ui/master/UserScript_for_king_of_time.user.js
// @description  This script will be running on the site of "King of Time".
// @author       daisuke.f
// @include      https://s3.kingtime.jp/admin/*
// @exclude      https://s3.kingtime.jp/admin/*?page_id=/employee/request_list*
// @exclude      https://s3.kingtime.jp/admin/*?page_id=/employee/change_password*
// @exclude      https://s3.kingtime.jp/admin/*?page_id=/schedule/schedule_pattern_list_for_employee*
// @required     https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
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
    // CSSを定義
    var css = {
        '#my_view_button': {
            'font-size': '0.2em',
            'background-color': 'DarkBlue',
            'color': 'white',
            'border': 'outset 2px DarkBlue',
            'border-radius': '5px',
            'padding': '0.5em',
            'box-shadow': '1px 1px 5px 2px gray'
        },
        '#my_dialog *': {
            'margin': 0,
            'padding': 0,
            'font-family': 'メイリオ',
        },
        '#my_dialog': {
            'background': 'white',
            'position': 'fixed',
            'top': 0,
            'left': 0,
            'border': 'ridge 2px navy',
            'box-shadow': '2px 2px 10px 4px gray',
            'border-radius': '0.5em',
            'z-index': '99'
        },
        '#my_dialog h2': {
            'font-size': '1em'
        },
        '#my_dialog input, #my_dialog select': {
            'background': 'white',
            'border': 'inset 1px silver',
            'margin': '0 0.5em'
        },
        '#my_dialog_header': {
            'text-align': 'center',
            'font-size': '0.8em',
            'font-weight': 'bold',
            'background': 'navy',
            'color': 'white',
            'padding': '0.5em',
            'box-shadow': '2px 2xp 2xp 2xp gray'
        },
        '#my_dialog_content': {
            'margin': '0.5em'
        },
        '.my_dialog_labels, .my_dialog_inputs': {
            'width': '150px',
            'padding': '0 5px',
            'float': 'left',
            'white-space': 'nowrap'
        },
        '.my_dialog_labels': {
            'text-align': 'center',
        },
        '.my_dialog_checkboxes': {
            'vertical-align': 'middle'
        },
        '#my_dialog_checkbox_area': {
            'padding': '0 2%',
            'clear': 'both'
        },
        '#my_dialog_button_area': {
            'margin': '0 0 0.5em 0',
            'text-align': 'center'
        },
        '#my_dialog input': {
            'width': '50px'
        },
        '#my_dialog_input_area input[type=number]': {
            'text-aligin': 'right'
        },
        '#my_dialog label': {
            'display': 'block',
            'padding': '0.2em 1em',
            'background': 'white',
            'border': 'none'
        },
        '#my_dialog button': {
            'padding': '0.5em',
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
    $('#menu_container').append('<button id="my_view_button">拡張ダイアログ表示</button>');

    // 入力補助ツールダイアログ生成
    $('body').append('<div id="my_dialog"></div>');
    var $myDialog = {
        self: $(document).find('#my_dialog'),
    };

    $myDialog.self
        .append('<div id="my_dialog_header"></div>')
        .append('<div id="my_dialog_content"></div>')
    ;

    $myDialog.header = $myDialog.self.find('#my_dialog_header');
    $myDialog.content = $myDialog.self.find('#my_dialog_content');
    $myDialog.content
        .append('<div id="my_dialog_input_area"></div>')
        .append('<div id="my_dialog_checkbox_area"></div>')
        .append('<div id="my_dialog_button_area"></div>')
        .append('<div id="my_dialog_hidden_area"></div>')
    ;
    $myDialog.content.inputArea = $myDialog.content.find('#my_dialog_input_area');
    $myDialog.content.checkboxArea = $myDialog.content.find('#my_dialog_checkbox_area');
    $myDialog.content.buttonArea = $myDialog.content.find('#my_dialog_button_area');
    $myDialog.content.hiddenArea = $myDialog.content.find('#my_dialog_hidden_area');


    $myDialog.header
        .append('<h2>拡張ダイアログ</h2>')
        .append('<button id="my_dialog_close" title="閉じる">×</button>')
    ;

    $myDialog.content.inputArea
        .append('<div><label for="my_dialog_schedule_pattern" class="my_dialog_labels">スケジュールパターン</label><div class="my_dialog_inputs"><select id="my_dialog_schedule_pattern"></select></div></div>')
        .append('<div><label for="my_start_time_hour my_start_time_minute" class="my_dialog_labels">出勤予定</label><div class="my_dialog_inputs"><input type="number" id="my_start_time_hour"></input>：<input type="number" id="my_start_time_minute"></input></div></div>')
        .append('<div><label for="my_end_time_hour my_end_time_minute" class="my_dialog_labels">退勤予定</label><div  class="my_dialog_inputs"><input type="number" id="my_end_time_hour"></input>：<input type="number" id="my_end_time_minute"></input></div></div>')
        .append('<div><label for="my_rest_time" class="my_dialog_labels">休憩予定時間</label><div class="my_dialog_inputs"><input type="number" id="my_rest_time"></input>分</div></div>')
    ;
    $myDialog.content.inputArea.find('#my_dialog_schedule_pattern')
        .append('<option value="常駐">常駐</option>')
        .append('<option value="休出">休出</option>')
    ;

    $myDialog.content.checkboxArea
        .append('<div class="my_dialog_checkboxes"><label for="my_dialog_anytime_show"><input type="checkbox" id="my_dialog_anytime_hidden" value="false"></input>画面遷移時に非表示する</label></div>')
        .append('<div class="my_dialog_checkboxes"><label for="my_dialog_auto_input"><input type="checkbox" id="my_dialog_auto_input" value="false"></input>画面遷移時に自動入力する</label></div>')
    ;

    $myDialog.content.buttonArea
        .append('<button id="my_save_button">状態を保存</button>')
        .append('<button id="my_schedule_enter_button">スケジュール入力</button>')
    ;

    $myDialog.content.hiddenArea
        .append('<input id="my_dialog_page_x" type="hidden" value="0"></input>')
        .append('<input id="my_dialog_page_y" type="hidden" value="0"></input>')
    ;

    // -----初期化
    // セッションストレージから値を取得
    $myDialog.self.find(':input').each(function() {
        var value = sessionStorage.getItem($(this).attr('id'), $(this).val());
        $(this).val(value);
    });

    // -----イベント登録
    // ドラッグ移動処理
    var propeties = {
        draggable: {
            before: {
                x: 0,
                y: 0,
                top: 0,
                left: 0
            },
            after: {
                x: 0,
                y: 0
            }
        }
    }
    $myDialog.header.mousedown(function(e) {
        var parsePosition = function(position) {
            return parseInt(position.replace('px', ''));
        };
        propeties.draggable.before = {
            x: e.pageX,
            y: e.pageY,
            top: parsePosition($myDialog.self.css('top')),
            left: parsePosition($myDialog.self.css('left'))
        }
        $('body').live('mousemove.draggable', function(e) {
            propeties.draggable.y = propeties.draggable.before.top + (e.pageY - propeties.draggable.before.y);
            propeties.draggable.x = propeties.draggable.before.left + (e.pageX - propeties.draggable.before.x);
            $myDialog.self
                .css('top', propeties.draggable.y)
                .css('left', propeties.draggable.x)
            ;
            $myDialog.content.hiddenArea.find('#my_dialog_page_x').val(propeties.draggable.x);
            $myDialog.content.hiddenArea.find('#my_dialog_page_y').val(propeties.draggable.y);
            return false;
        });
        return false;
    });
    $('body').mouseup(function(e) {
        $('body').die('mousemove.draggable');
    });


    // [入力補助表示]ボタンの動作
    $(document).find('#my_view_button').click(function(e) {
        $myDialog.self.toggle();
    });

    // [入力を保存]ボタンの動作
    // セッションストレージに値を保存
    $myDialog.content.buttonArea.find('#my_save_button').click(function() {
        $myDialog.self.find(':input').each(function() {
            sessionStorage.setItem($(this).attr('id'), $(this).val());
        });
    });

    // チェックボックスをクリック時の処理
    $myDialog.self.find('input[type=checkbox]').click(function() {
        $(this).val($(this).prop('checked'));
    });

    // [×]ボタン動作
    $myDialog.self.find('#my_dialog_close').click(function() {
        $myDialog.self.hide();
    });

    // [スケジュール入力]ボタン動作
    $myDialog.content.buttonArea.find('#my_schedule_enter_button').click(function() {
        var schedule_pattern = $('#my_dialog_schedule_pattern').val();
        $('#select_schedule_pattern_id > option').each(function() {
            if($(this).text() === schedule_pattern) {
                $(this).attr('selected', true);
            } else {
                $(this).attr('selected', false);
            }
        });
        var startTimeHour = $('#my_start_time_hour').val(), startTimeMinute = $('#my_start_time_minute').val();
        var endTimeHour = $('#my_end_time_hour').val(), endTimeMinute = $('#my_end_time_minute').val();
        var restTime = $('#my_rest_time').val();
        console.log(restTime);
        $('#schedule_start_time_hour').val(startTimeHour);
        $('#schedule_start_time_minute').val(startTimeMinute);
        $('#schedule_end_time_hour').val(endTimeHour);
        $('#schedule_end_time_minute').val(endTimeMinute);
        $('#schedule_break_minute').val(restTime);
    });


    //-----終了処理
    // チェックボックスの状態反映
    $myDialog.self.find('input[type=checkbox]').each(function() {
        var checked = $(this).val().toLowerCase() === 'true';
        $(this).prop('checked', checked);
    });

    // 画面遷移時に表示するチェック時の動作
    $myDialog.anyTimeHidden = $myDialog.self.find('#my_dialog_anytime_hidden');
    if ($myDialog.anyTimeHidden.val() === 'true') {
        $myDialog.self.hide();
    } else {
        $myDialog.self.show();
    }

    // 画面遷移時に自動入力するチェック時の動作
    $myDialog.autoInput = $myDialog.self.find('#my_dialog_auto_input');
    if ($myDialog.autoInput.val() === 'true') {
        $myDialog.self.find('#my_schedule_enter_button').click();
    }


    // CSSを適用する
    Object.keys(css).forEach(function(selector) {
        $(selector).css(css[selector]);
    });

    // ダイアログの初期ポジション設定
    $myDialog.self
        .css('top', $myDialog.self.find('#my_dialog_page_y').val() + 'px')
        .css('left', $myDialog.self.find('#my_dialog_page_x').val() + 'px')
    ;
});