(function (Modules) {
  "use strict";

  Modules.AccordionWithDescriptions = function() {

    this.start = function($element) {

      // Indicate that js has worked
      $element.addClass('js-accordion-with-descriptions');

       // Prevent FOUC, remove class hiding content
      $element.removeClass('js-hidden');

      // Insert the markup for the subsection-controls
      $element.prepend( '<div class="subsection-controls js-subsection-controls"><button aria-expanded="false">Open all</button></div>' );

      var $subsectionTitle = $element.find('.subsection__title');

      // Wrap each title in a button, with aria controls matching the ID of the subsection
      $subsectionTitle.each(function(index) {
        $(this).wrapInner( '<button class="subsection__button" aria-expanded="false" aria-controls="subsection_content_' + index +'"></a>' );
      });

      var $subsectionButton = $element.find('.subsection__button');
      var $subsectionHeader = $element.find('.subsection__header');

      // Get all the sections
      var totalSubsections = $element.find('.subsection__content').length;

      // For each of the sections, create a string with all the subsection content IDs
      var ariaControlsValue = "";

      for (var i = 0; i < totalSubsections; i++) {
        ariaControlsValue += "subsection_content_"+i+" ";
      }

      // Get the open/close all button
      var $openOrCloseAllButton = $element.find('.js-subsection-controls button');

      // Set the aria controls for the open/close all button value for all content items
      $openOrCloseAllButton.attr('aria-controls', ariaControlsValue);

      // Hide the content
      var $subsectionContent = $element.find('.subsection__content');
      closeSection($subsectionContent);

      // Insert the subsection icon
      $subsectionHeader.append( '<span class="subsection__icon"></span>' );

      // Add toggle functionality individual sections
      $subsectionHeader.on('click', function(e) {
        toggleSection($(this).next());
        toggleIcon($(this));
        toggleState($(this).find('.subsection__button'));
        setOpenCloseAllText();
        return false;
      });

      $subsectionButton.on('click', function(e) {
        toggleSection($(this).parent().parent().next());
        toggleIcon($(this).parent().parent());
        toggleState($(this));
        setOpenCloseAllText();
        return false;
      });

      function setOpenCloseAllText() {
        var openSubsections = $('.subsection--is-open').length;
        // Find out if the number of is-opens == total number of sections
        if (openSubsections === totalSubsections) {
          $openOrCloseAllButton.text('Close all');
        } else {
          $openOrCloseAllButton.text('Open all');
        }
      }

      function toggleSection($node) {
        if ($($node).hasClass('js-hidden')) {
          openSection($node);
        } else {
          closeSection($node);
        }
      }

      function toggleIcon($node) {
        if ($($node).parent().hasClass('subsection--is-open')) {
          $node.parent().removeClass('subsection--is-open');
          $node.parent().addClass('subsection');
        } else {
          $node.parent().removeClass('subsection');
          $node.parent().addClass('subsection--is-open');
        }
      }

      function toggleState($node) {
        if ($($node).attr('aria-expanded') == "true") {
          $node.attr("aria-expanded", "false");
        } else {
          $node.attr("aria-expanded", "true");
        }
      }

      function openSection($node) {
        $node.removeClass('js-hidden');
      }

      function closeSection($node) {
        $node.addClass('js-hidden');
      }

      function showOpenIcon($node) {
        $node.parent().removeClass('subsection');
        $node.parent().addClass('subsection--is-open');
      }

      function showCloseIcon($node) {
        $node.parent().removeClass('subsection--is-open');
        $node.parent().addClass('subsection');
      }

      function setExpandedState($node, state) {
        $node.attr("aria-expanded", state);
      }

      // Add the toggle functionality all sections
      $openOrCloseAllButton.on('click', function(e) {
        var action = '';

        // update button text
        if ($openOrCloseAllButton.text() == "Open all") {
          $openOrCloseAllButton.text("Close all");
          $openOrCloseAllButton.attr("aria-expanded", "true");
          action = 'open';
        } else {
          $openOrCloseAllButton.text("Open all");
          $openOrCloseAllButton.attr("aria-expanded", "false");
          action = 'close';
        }

        // Set aria-expanded for each button
        $subsectionButton.each(function( index ) {
          if (action == 'open') {
            setExpandedState($(this), "true");
          } else {
            setExpandedState($(this), "false");
          }
        });

        // show/hide content
        $subsectionHeader.each(function( index ) {
          if (action == 'open') {
            openSection($(this).next());
            showOpenIcon($(this));
          } else {
            closeSection($(this).next());
            showCloseIcon($(this));
          }
        });

        return false;
      });
    }
  };
})(window.GOVUK.Modules);