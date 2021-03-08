<?php
namespace OmekaTheme\Helper;

use Laminas\View\Helper\AbstractHelper;

class CurrentSite extends AbstractHelper
{
    /**
     * Get the current site from the view.
     */
    public function __invoke(): ?\Omeka\Api\Representation\SiteRepresentation
    {
        return $this->view->site ?? $this->view
             ->getHelperPluginManager()
             ->get('Laminas\View\Helper\ViewModel')
             ->getRoot()
             ->getVariable('site');
    }
}
