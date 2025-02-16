<?php

namespace WPTableBuilder;

class BlockProvidor
{
    private static $free_blocks = [];
    private static $pro_blocks = [];

    public static function getFreeBlocks()
    {
        return self::$free_blocks;
    }

    public static function getProBlocks()
    {
        return self::$pro_blocks;
    }

    public static function registerBlock($block, $pro = false)
    {
        if ($pro) {
            self::$pro_blocks[] = $block;
        } else {
            self::$free_blocks[] = $block;
        }
    }
}