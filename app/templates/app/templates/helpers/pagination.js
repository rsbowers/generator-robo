/**
 * Pagination and comparision helper function added by Kunal Vashist
 */
'use strict';

// Export helpers
module.exports.register = function (Handlebars, options) {
    /*added by kunal for pagination */
    Handlebars.registerHelper('pagination', function(activePage, totalPage, size, viewall, options) {
        var startPage, endPage, context,viewall;
            startPage = activePage - Math.floor(size / 2);
            endPage = activePage + Math.floor(size / 2);
            viewall = viewall || false;

            if (startPage <= 0) {
                endPage -= (startPage - 1);
                startPage = 1;
            }

            if (endPage > totalPage) {
                endPage = totalPage;
                if (endPage - size + 1 > 0) {
                    startPage = endPage - size + 1;
                } else {
                    startPage = 1;
                }
            }

            context = {
                startingIndex: false,
                pages: [],
                lastPage:true,
                endingIndex: false,
                viewall : false
            };

            context.viewall = viewall;

            if (startPage === 1) {
                context.startingIndex = true;
            }

            if(totalPage >= size){
                context.lastPageCount = totalPage;
            }

            for (var i = startPage; i <= endPage; i++) {
                context.pages.push({
                    page: i,
                    isCurrent: i === activePage
                });
            }

            if (endPage === totalPage) {
                context.endingIndex = true;
            }

        return options.fn(context);
    });
}
