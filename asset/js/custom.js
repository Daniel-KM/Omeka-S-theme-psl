// TODO Manage translation for texts in theme.
// var translateAccessToFiles = 'Access to files';
var translateAccessToFiles = 'Accès aux fichiers';

/* ==== Psl search form ==== */
$(document).ready(function() {
    $('#psl-toolbox li').on('mouseenter', function() {
        $('#psl-toolbox > div').hide();
        $('#psl-toolbox div' + $(this).find('a').attr('href')).show();
    });
    $('#psl-toolbox').on('mouseleave', function(e) {
        $('#psl-toolbox > div').hide();
    });
});

/* ==== search/facets ==== */
$(document).ready(function() {
    $('.search-sidebar > ul a').on('click', function(e) {
        e.preventDefault();

        $('.search-sidebar > div').hide();
        $('.search-sidebar > ul a').removeClass('active');

        $($(this).attr('href')).show();
        $(this).addClass('active');
    }).first().click();
});

/* ==== search/results-header ==== */
$(document).ready(function() {
    $('.sort-direction').on('click', function() {
        Search.sortBy($(this).attr('data-name'));
    });
    $('.sort-label').on('click', function() {
        var direction = $(this).parents('.sort-field')
            .find('.sort-direction')
            .not('.sort-active')
            .first();
        if (direction.length) {
            Search.sortBy(direction.attr('data-name'));
        }
    });
});

/* ==== item/show ==== */
$(document).ready(function() {
    var mediaList = $('div.media-list');
    if (mediaList.length) {
        $('<a>')
            .addClass('media-list-toggle')
            // TODO Use Omeka.jsTranslate.
            .html(translateAccessToFiles)
            .on('click', function(e) {
                e.preventDefault();
                if (mediaList.is(':visible')) {
                    mediaList.hide();
                    $(this).removeClass('media-list-visible');
                    $(this).addClass('media-list-hidden');
                } else {
                    mediaList.show();
                    $(this).removeClass('media-list-hidden');
                    $(this).addClass('media-list-visible');
                }
            })
            .insertBefore(mediaList)
            .trigger('click');
    }
});

/* ==== item/browse ==== */
$(document).ready(function() {
    $('.browse-sort select').on('change', function() {
        Search.sortBy($(this).val());
    });

    $('.browse-view-type-list').on('click', function(e) {
        e.preventDefault();
        Search.setViewType('list');
        $('.browse-view-type').removeClass('active');
        $(this).addClass('active');
    });

    $('.browse-view-type-grid').on('click', function(e) {
        e.preventDefault();
        Search.setViewType('grid');
        $('.browse-view-type').removeClass('active');
        $(this).addClass('active');
    });

    var view_type = localStorage.getItem('search_view_type');
    if (!view_type) {
        view_type = 'list';
    }
    $('.browse-view-type-' + view_type).click();
});

/* ==== basket/show ==== */
$(document).ready(function() {
    var objectFromQueryString = function(str) {
        var params = {};
        str
            .replace(/(^\?)/, '')
            .split("&")
            .filter(function(element) { return element !== '' })
            .forEach(function(n) {
                n = n.split('=');
                var name = decodeURIComponent(n[0]);
                if (!params.hasOwnProperty(name)) {
                    params[name] = decodeURIComponent(n[1]);
                } else {
                    if (!Array.isArray(params[name])) {
                        params[name] = [params[name]];
                    }
                    params[name].push(decodeURIComponent(n[1]));
                }
            });

        return params;
    };

    var queryStringFromObject = function(obj) {
        return Object.keys(obj).map(function(name) {
            if (Array.isArray(obj[name])) {
                return obj[name].map(function(value) {
                    return name + '=' + value;
                }).join('&');
            } else {
                return name + '=' + obj[name];
            }
        }).join('&');
    };

    var sortBy = function(sort_by, sort_order) {
        var params = objectFromQueryString(document.location.search);
        params['sort'] = sort_by + ' ' + sort_order;
        window.location.search = '?' + queryStringFromObject(params);
    };

    $('.sort-direction').on('click', function() {
        sortBy($(this).attr('data-sort-by'), $(this).attr('data-sort-order'));
    });
    $('.sort-label').on('click', function() {
        var direction = $(this).parents('.sort-field')
            .find('.sort-direction')
            .not('.sort-active')
            .first();
        if (direction) {
            sortBy(direction.attr('data-sort-by'), direction.attr('data-sort-order'));
        }
    });

    var setViewType = function(viewType) {
        var resourceLists = document.querySelectorAll("div.resource-list");
        for (var i = 0; i < resourceLists.length; i++) {
            var resourceItem = resourceLists[i];
            resourceItem.classList.remove('list');
            resourceItem.classList.remove('grid');
            resourceItem.classList.add(viewType);
        }
        localStorage.setItem('basket_view_type', viewType);
    };

    var viewType = localStorage.getItem('basket_view_type');
    if (!viewType) {
        viewType = 'grid';
    }
    setViewType(viewType);

    $('#basket-view-type-list').on('click', function(e) {
        e.preventDefault();
        setViewType('list');
    });
    $('#basket-view-type-grid').on('click', function(e) {
        e.preventDefault();
        setViewType('grid');
    });
});
