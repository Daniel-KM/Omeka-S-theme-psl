<?php declare(strict_types=1);

namespace OmekaTheme\Helper;

use Laminas\View\Helper\AbstractHelper;

class IsHomePage extends AbstractHelper
{
    /**
     * Check if the current page is the home page (first page in main menu).
     */
    public function __invoke(): bool
    {
        $site = $this->currentSite();

        if (empty($site)) {
            return false;
        }

        $view = $this->getView();
        $urlHelper = $view->plugin('url');

        // Check the alias of the root of Omeka S with rerouting.
        if ($this->isCurrentUrl($view->basePath())) {
            return true;
        }

        $homepage = $site->homepage();
        if ($homepage) {
            $url = $urlHelper('site/page', [
                'site-slug' => $site->slug(),
                'page-slug' => $homepage->slug(),
            ]);
            if ($this->isCurrentUrl($url)) {
                return true;
            }
        }

        // Check the first normal pages.
        $linkedPages = $site->linkedPages();
        if ($linkedPages) {
            $firstPage = current($linkedPages);
            $url = $urlHelper('site/page', [
                 'site-slug' => $site->slug(),
                 'page-slug' => $firstPage->slug(),
             ]);
            if ($this->isCurrentUrl($url)) {
                return true;
            }
        }

        // Check the root of the site.
        $url = $urlHelper('site', ['site-slug' => $site->slug()]);
        if ($this->isCurrentUrl($url)) {
            return true;
        }

        return false;
    }

    /**
     * Check if the given URL matches the current request URL.
     *
     * Upgrade of a method of Omeka Classic / globals.php.
     *
     * @param string $url May be relative or absolute
     * @return bool
     */
    protected function isCurrentUrl(string $url): bool
    {
        $view = $this->getView();
        $currentUrl = $this->currentUrl();
        $serverUrl = $view->serverUrl();
        $baseUrl = $view->basePath();

        // Strip out the protocol, host, base URL, and rightmost slash before
        // comparing the URL to the current one
        $stripOut = [$serverUrl . $baseUrl, @$_SERVER['HTTP_HOST'], $baseUrl];
        $currentUrl = rtrim(str_replace($stripOut, '', $currentUrl), '/');
        $url = rtrim(str_replace($stripOut, '', $url), '/');

        if (strlen($url) == 0) {
            return strlen($currentUrl) == 0;
        }
        // Don't check if the url is part of the current url.
        return $url == $currentUrl;
    }

    /**
     * Get the current URL.
     */
    protected function currentUrl($absolute = false): string
    {
        return $absolute
             ? $this->view->serverUrl(true)
             : $this->view->url(null, [], true);
    }

    /**
     * Get the current site.
     */
    protected function currentSite(): ?\Omeka\Api\Representation\SiteRepresentation
    {
        return isset($this->view->site)
            ? $this->view->site
            : $this->view->getHelperPluginManager()->get('Laminas\View\Helper\ViewModel')->getRoot()->getVariable('site');
    }
}
