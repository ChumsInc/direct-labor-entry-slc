<?php
/**
 * @package Chums
 * @subpackage Routings
 * @author Steve Montgomery
 * @copyright Copyright &copy; 2012, steve
 */

use chums\ui\WebUI2;
use chums\user\Groups;
use chums\ui\CSSOptions;

require_once "autoload.inc.php";

$ui = new WebUI2([
    'title' => 'SLC Direct Labor Entry',
    'bodyClassName' => 'container-fluid',
    'requiredRoles' => [Groups::DIRECTLABOR, Groups::PRODUCTION],
]);
$ui->addManifestJSON('./public/js/manifest.json')
    ->addCSS('./public/styles.css', CSSOptions::parse(['useTimestampVersion' => true]))
    ->render();
