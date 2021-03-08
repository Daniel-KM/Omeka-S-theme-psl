<?php
namespace OmekaTheme\Helper;

use Laminas\View\Helper\AbstractHelper;

class FrontPageImage extends AbstractHelper
{
    /**
     * Select a random asset url from the settings and add it to the css.
     *
     * @param string $elementToStyle Css tag/id/class path to set for image.
     */
    public function __invoke($elementToStyle = '#front-page-image')
    {
        $view = $this->getView();
        $themeSettingAssetUrl = $view->plugin('themeSettingAssetUrl');

        $frontPageImages = [];
        for ($i = 1; $i < 11; $i++) {
            $frontPageImage = $themeSettingAssetUrl("front_page_image_$i");
            if ($frontPageImage) {
                $frontPageImages[] = $frontPageImage;
            }
        }

        if (!count($frontPageImages)) {
            return;
        }

        $index = rand(0, count($frontPageImages) - 1);
        $url = $frontPageImages[$index];
        $view->headStyle()
            ->appendStyle($elementToStyle . '{ background-image: url("' . $url . '"); }');
    }
}
