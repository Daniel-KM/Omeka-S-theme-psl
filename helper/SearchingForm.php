<?php
namespace OmekaTheme\Helper;

use Laminas\View\Helper\AbstractHelper;

class SearchingForm extends AbstractHelper
{
    public function __invoke()
    {
        $view = $this->getView();

        if ($view->getHelperPluginManager()->has('searchForm')) {
            $searchMainPage = $view->siteSetting('search_main_page');
            if ($searchMainPage) {
                $searchPage = $view->api()->searchOne('search_pages', ['id' => $searchMainPage])->getContent();
                if ($searchPage) {
                    return $view->searchForm($searchPage);
                }
            }
        }

        $html = '<div id="search">';
        $html .= $view->partial('common/search-form');
        $html .= '</div>';
        return $html;
    }
}
