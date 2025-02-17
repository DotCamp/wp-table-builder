<?php

namespace WpTableBuilder\Blocks;

interface Base
{
    public function getTitle();
    public function render($block);
}