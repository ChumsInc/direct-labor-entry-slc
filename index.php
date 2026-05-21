<?php
/**
 * @package Chums
 * @subpackage Routings
 * @author Steve Montgomery
 * @copyright Copyright &copy; 2012, steve
 */

use chums\ui\WebUI2;
use chums\user\Groups;

require_once "autoload.inc.php";

$ui = new WebUI2([
    'title' => 'SLC Direct Labor Entry',
    'bodyClassName' => 'container-fluid',
    'requiredRoles' => [Groups::DIRECTLABOR, Groups::PRODUCTION],
]);
$ui->addViteManifest()
    ->render();
