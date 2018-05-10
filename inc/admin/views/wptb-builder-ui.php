<?php 

use WP_Table_Builder as NS;

?>

<div class="wptb-admin-container">
    <div class="wptb-header">
        <div class="wptb-logo">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 478.854 478.854" style="enable-background:new 0 0 478.854 478.854;" xml:space="preserve" width="64" height="64" class=""><g><path style="fill:#0B1C28;" d="M444.101,478.854c-25.183-89.379-107.244-154.915-204.674-154.915S59.936,389.475,34.753,478.854  H444.101z" data-original="#0B1C28" class=""/><path style="fill:#1B374F;" d="M378.738,224.737c0,63.126-51.184,114.31-114.31,114.31h-50.003  c-63.126,0-114.31-51.184-114.31-114.31v-46.434c0-63.126,51.184-114.31,114.31-114.31h50.003c63.126,0,114.31,51.184,114.31,114.31  V224.737z" data-original="#1B374F" class=""/><path style="fill:#0B1C28;" d="M378.738,178.302v46.434c0,63.126-51.184,114.31-114.31,114.31h-50.003" data-original="#0B1C28" class=""/><g>
	        <circle style="fill:#DDDD85;" cx="173.812" cy="213.67" r="13.131" data-original="#DDDD85" class=""/>
	        <circle style="fill:#DDDD85;" cx="305.066" cy="213.67" r="13.131" data-original="#DDDD85" class=""/>
            </g><path style="fill:#1E9720" d="M382.031,154.798c0.047-1.063,0.165-2.095,0.165-3.167c0-78.848-63.913-142.769-142.769-142.769  c-78.864,0-142.769,63.921-142.769,142.769c0,1.079,0.134,2.111,0.165,3.167H382.031z" data-original="#FFB600" class="" data-old_color="#1F9721"/><path style="fill:#1D8A2E" d="M317.117,154.798c0.016-1.063,0.095-2.095,0.095-3.167c0-78.848-34.832-142.769-77.785-142.769  c-42.961,0-77.785,63.921-77.785,142.769c0,1.079,0.071,2.111,0.095,3.167H317.117z" data-original="#FF9D00" class="" data-old_color="#1E8A2F"/><path style="fill:#0EB51F" d="M392.365,158.531c0,4.34-3.521,7.877-7.877,7.877H94.366c-4.356,0-7.877-3.537-7.877-7.877l0,0  c0-4.356,3.521-7.877,7.877-7.877h290.123C388.844,150.654,392.365,154.183,392.365,158.531L392.365,158.531z" data-original="#FFE000" class="active-path" data-old_color="#0EB61F"/><path style="fill:#1E9720" d="M279.796,83.693c0,13.06-10.587,23.631-23.631,23.631h-33.477c-13.044,0-23.631-10.571-23.631-23.631  V12.8c0-13.044,10.587-12.8,23.631-12.8h33.477c13.044,0,23.631-0.244,23.631,12.8V83.693z" data-original="#FFB600" class="" data-old_color="#1F9721"/><path style="fill:#0EB51F" d="M256.166,0h-33.477c-13.044,0-23.631-0.244-23.631,12.8v55.8c0,13.044,10.587,23.631,23.631,23.631  h33.477c13.044,0,23.631-10.587,23.631-23.631V12.8C279.796-0.252,269.21,0,256.166,0z" data-original="#0EB61F" class="active-path" data-old_color="#0EB61F"/><g>
	        <path style="fill:#1E9720" d="M133.75,456.673c0,3.631-2.954,6.585-6.585,6.585h-15.722c-3.631,0-6.585-2.954-6.585-6.585V352.839   c0-3.647,2.954-6.585,6.585-6.585h15.722c3.631,0,6.585,2.938,6.585,6.585V456.673z" data-original="#FFB600" class="" data-old_color="#1F9721"/>
	        <path style="fill:#1E9720" d="M373.996,456.673c0,3.631-2.954,6.585-6.585,6.585h-15.722c-3.631,0-6.585-2.954-6.585-6.585   V352.839c0-3.647,2.954-6.585,6.585-6.585h15.722c3.631,0,6.585,2.938,6.585,6.585V456.673z" data-original="#FFB600" class="" data-old_color="#1F9721"/>
            </g></g> </svg>
        </div>
        <div class="wptb-right">
            <div class="wptb-close">
                <a href="<?php echo admin_url('admin.php?page=wptb-overview'); ?>"><span class="dashicons dashicons-no" style="font-size: 30px; width: 30px; height: 30px;"></span></a>
            </div>
        </div>
    </div>
    <div class="wptb-container">
        <div class="wptb-left-panel">
            <div class="wptb-elements-section">
                <ul class="wptb-tabs wptb-clear">

                    <li class="wptb-tab" id="add-elements">
                        <a href="#" class="active">
                            Add Elements
                        </a>
                    </li>

                    <li class="wptb-tab" id="element-options">
                        <a href="#">
                            Element Options
                        </a>
                    </li>

                </ul>
                <div class="add-elements wptb-tab-content">
                    <div class="wptb-elements-container">
                        <div class="wptb-element left">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="40px" height="50px"><path d="M59.7 0h-51.2C3.8 0 0 3.8 0 8.5v51.2c0 4.7 3.8 8.5 8.5 8.5h51.2c4.7 0 8.5-3.8 8.5-8.5v-51.2C68.3 3.8 64.4 0 59.7 0zM51.2 51.2H17.1V17.1H51.2V51.2z"/><path d="M503.5 0h-51.2c-4.7 0-8.5 3.8-8.5 8.5v51.2c0 4.7 3.8 8.5 8.5 8.5h51.2c4.7 0 8.5-3.8 8.5-8.5v-51.2C512 3.8 508.2 0 503.5 0zM494.9 51.2H460.8V17.1h34.1V51.2z"/><path d="M59.7 443.7h-51.2c-4.7 0-8.5 3.8-8.5 8.5v51.2C0 508.2 3.8 512 8.5 512h51.2c4.7 0 8.5-3.8 8.5-8.5v-51.2C68.3 447.5 64.4 443.7 59.7 443.7zM51.2 494.9H17.1V460.8H51.2V494.9z"/><path d="M503.5 443.7h-51.2c-4.7 0-8.5 3.8-8.5 8.5v51.2c0 4.7 3.8 8.5 8.5 8.5h51.2c4.7 0 8.5-3.8 8.5-8.5v-51.2C512 447.5 508.2 443.7 503.5 443.7zM494.9 494.9H460.8V460.8h34.1V494.9z"/><path d="M477.9 51.2H460.8V34.1c0-4.7-3.8-8.5-8.5-8.5H59.7c-4.7 0-8.5 3.8-8.5 8.5V51.2H34.1c-4.7 0-8.5 3.8-8.5 8.5v392.5c0 4.7 3.8 8.5 8.5 8.5H51.2v17.1c0 4.7 3.8 8.5 8.5 8.5h392.5c4.7 0 8.5-3.8 8.5-8.5V460.8h17.1c4.7 0 8.5-3.8 8.5-8.5V59.7C486.4 55 482.6 51.2 477.9 51.2zM469.3 443.7h-17.1c-4.7 0-8.5 3.8-8.5 8.5v17.1H68.3v-17.1c0-4.7-3.8-8.5-8.5-8.5H42.7V68.3h17.1c4.7 0 8.5-3.8 8.5-8.5V42.7h375.5v17.1c0 4.7 3.8 8.5 8.5 8.5h17.1V443.7z"/><path d="M401.1 76.8H110.9c-4.7 0-8.5 3.8-8.5 8.5V153.6c0 4.7 3.8 8.5 8.5 8.5h34.1c4.7 0 8.5-3.8 8.5-8.5V128h76.8v256h-34.1c-4.7 0-8.5 3.8-8.5 8.5v34.1c0 4.7 3.8 8.5 8.5 8.5h119.5c4.7 0 8.5-3.8 8.5-8.5v-34.1c0-4.7-3.8-8.5-8.5-8.5H281.6V128h76.8v25.6c0 4.7 3.8 8.5 8.5 8.5h34.1c4.7 0 8.5-3.8 8.5-8.5V85.3C409.6 80.6 405.8 76.8 401.1 76.8zM392.5 145.1h-17.1v-25.6c0-4.7-3.8-8.5-8.5-8.5h-93.9c-4.7 0-8.5 3.8-8.5 8.5v273.1c0 4.7 3.8 8.5 8.5 8.5H307.2v17.1H204.8v-17.1h34.1c4.7 0 8.5-3.8 8.5-8.5V119.5c0-4.7-3.8-8.5-8.5-8.5h-93.9c-4.7 0-8.5 3.8-8.5 8.5v25.6h-17.1v-51.2h273.1V145.1z"/></svg>
                            <p>Text</p>
                        </div>
                        <div class="wptb-element right">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 489.4 489.4" width="40px" height="50px"><path d="M0 437.8c0 28.5 23.2 51.6 51.6 51.6h386.2c28.5 0 51.6-23.2 51.6-51.6V51.6c0-28.5-23.2-51.6-51.6-51.6H51.6C23.1 0 0 23.2 0 51.6 0 51.6 0 437.8 0 437.8zM437.8 464.9H51.6c-14.9 0-27.1-12.2-27.1-27.1v-64.5l92.8-92.8 79.3 79.3c4.8 4.8 12.5 4.8 17.3 0l143.2-143.2 107.8 107.8v113.4C464.9 452.7 452.7 464.9 437.8 464.9zM51.6 24.5h386.2c14.9 0 27.1 12.2 27.1 27.1v238.1l-99.2-99.1c-4.8-4.8-12.5-4.8-17.3 0L205.2 333.8l-79.3-79.3c-4.8-4.8-12.5-4.8-17.3 0l-84.1 84.1v-287C24.5 36.7 36.7 24.5 51.6 24.5z"/><path d="M151.7 196.1c34.4 0 62.3-28 62.3-62.3s-28-62.3-62.3-62.3 -62.3 28-62.3 62.3S117.3 196.1 151.7 196.1zM151.7 96c20.9 0 37.8 17 37.8 37.8s-17 37.8-37.8 37.8 -37.8-17-37.8-37.8S130.8 96 151.7 96z"/></svg>
                            <p>Image</p>
                        </div>
                        <div class="wptb-element left">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 65 65"><path d="M64.5 24.1c0 3.8-3.1 6.9-6.9 6.9H7.4C3.6 31 0.5 27.9 0.5 24.1V6.9C0.5 3.1 3.6 0 7.4 0h50.1C61.4 0 64.5 3.1 64.5 6.9V24.1zM60.5 6.9C60.5 5.3 59.2 4 57.6 4H7.4C5.8 4 4.5 5.3 4.5 6.9v17.1c0 1.6 1.3 2.9 2.9 2.9h50.1c1.6 0 2.9-1.3 2.9-2.9L60.5 6.9 60.5 6.9z"/><path d="M64.5 58.1c0 3.8-3.1 6.9-6.9 6.9H7.4C3.6 65 0.5 61.9 0.5 58.1V40.9C0.5 37.1 3.6 34 7.4 34h50.1c3.8 0 6.9 3.1 6.9 6.9L64.5 58.1 64.5 58.1zM60.5 40.9c0-1.6-1.3-2.9-2.9-2.9H7.4C5.8 38 4.5 39.3 4.5 40.9v17.1c0 1.6 1.3 2.9 2.9 2.9h50.1c1.6 0 2.9-1.3 2.9-2.9L60.5 40.9 60.5 40.9z"/><path d="M8.5 16c-0.6 0-1-0.4-1-1v-1.8C7.5 10.4 9.8 8 12.4 8h6.2c0.6 0 1 0.4 1 1s-0.4 1-1 1h-6.2c-1.6 0-2.9 1.7-2.9 3.2V15C9.5 15.6 9.1 16 8.5 16z"/><path d="M8.6 19.4c-0.3 0-0.5-0.1-0.7-0.3 -0.2-0.2-0.3-0.4-0.3-0.7 0-0.3 0.1-0.5 0.3-0.7 0.4-0.4 1-0.4 1.4 0 0.2 0.2 0.3 0.5 0.3 0.7 0 0.3-0.1 0.5-0.3 0.7C9.1 19.3 8.9 19.4 8.6 19.4z"/></svg>
                            <p>Button</p>
                        </div>
                        <div class="wptb-element right">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="40px" height="50px">
                            <path d="M469.3 0H42.7C19.1 0 0 19.1 0 42.7v426.7C0 492.9 19.1 512 42.7 512h426.7C492.9 512 512 492.9 512 469.3V42.7C512 19.1 492.9 0 469.3 0zM494.9 469.3c0 14.1-11.5 25.6-25.6 25.6H42.7c-14.1 0-25.6-11.5-25.6-25.6V42.7c0-14.1 11.5-25.6 25.6-25.6h426.7c14.1 0 25.6 11.5 25.6 25.6V469.3z"/><path d="M119.5 230.4c-14.1 0-25.6 11.5-25.6 25.6s11.5 25.6 25.6 25.6 25.6-11.5 25.6-25.6S133.6 230.4 119.5 230.4zM119.5 264.5c-4.7 0-8.5-3.8-8.5-8.5s3.8-8.5 8.5-8.5S128 251.3 128 256 124.2 264.5 119.5 264.5z"/><path d="M409.6 247.5H170.7c-4.7 0-8.5 3.8-8.5 8.5s3.8 8.5 8.5 8.5H409.6c4.7 0 8.5-3.8 8.5-8.5S414.3 247.5 409.6 247.5z"/><path d="M119.5 110.9c-14.1 0-25.6 11.5-25.6 25.6s11.5 25.6 25.6 25.6 25.6-11.5 25.6-25.6S133.6 110.9 119.5 110.9zM119.5 145.1c-4.7 0-8.5-3.8-8.5-8.5s3.8-8.5 8.5-8.5 8.5 3.8 8.5 8.5S124.2 145.1 119.5 145.1z"/><path d="M409.6 128H170.7c-4.7 0-8.5 3.8-8.5 8.5s3.8 8.5 8.5 8.5H409.6c4.7 0 8.5-3.8 8.5-8.5S414.3 128 409.6 128z"/><path d="M119.5 349.9c-14.1 0-25.6 11.5-25.6 25.6s11.5 25.6 25.6 25.6 25.6-11.5 25.6-25.6S133.6 349.9 119.5 349.9zM119.5 384c-4.7 0-8.5-3.8-8.5-8.5s3.8-8.5 8.5-8.5 8.5 3.8 8.5 8.5S124.2 384 119.5 384z"/><path d="M409.6 366.9H170.7c-4.7 0-8.5 3.8-8.5 8.5s3.8 8.5 8.5 8.5H409.6c4.7 0 8.5-3.8 8.5-8.5S414.3 366.9 409.6 366.9z"/></svg>
                        <p>List</p>
                        </div>
                    </div>
                </div>

                <div id="element-options" class="wptb-tab-content" style="display: none;">
                    Elements Options Goes Here
                </div>
            </div>
            <div class="wptb-settings-section">
                <div class="wptb-settings-dropdown">
                    Table Settings
                </div>
                <p>Settings Items will go here</p>
            </div>
        </div>
        <div class="wptb-builder-panel">
            <div class="wrapper">
                <table class="wptb-table" style="text-align: center">
                    <thead>
                        <tr class="wptb-row wptb-table-header green">
                            <th class="wptb-cell">Rank</th>
                            <th class="wptb-cell">Plugin</th>
                            <th class="wptb-cell">Our Rating</th>
                            <th class="wptb-cell">Price</th>
                            <th class="wptb-cell">Download</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="wptb-row">
                            <td class="wptb-cell">1</td>
                            <td class="wptb-cell">WP Table Builder</td>
                            <td class="wptb-cell">5 Stars</td>
                            <td class="wptb-cell">Free</td>
                            <td class="wptb-cell"><button style="padding: 10px">Download</button></td>
                        </tr>
                        <tr class="wptb-row">
                            <td class="wptb-cell">2</td>
                            <td class="wptb-cell">TablePress</td>
                            <td class="wptb-cell">5 Stars</td>
                            <td class="wptb-cell">Free</td>
                            <td class="wptb-cell"><button style="padding: 10px">Download</button></td>
                        </tr>
                        <tr class="wptb-row">
                            <td class="wptb-cell">3</td>
                            <td class="wptb-cell">Table Maker</td>
                            <td class="wptb-cell">4 Stars</td>
                            <td class="wptb-cell">$19.99</td>
                            <td class="wptb-cell"><button style="padding: 10px">Buy</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>