/**
 *
 * @license MIT License Copyright (c) 2017 Abhijit Gurav
 * @author  Abhijit Gurav, https://github.com/abhijit-g/
 *
 */

/**
 *  @ngdoc object
 *  @name service.gameService
 *
 *
 *  @description
 *  This service will help to draw canvas, images and text
 */
angular.module("snake")
    .factory("gameService", [function() {
       "use strict";
        return {
            /**
             * @ngdoc method
             * @name service.gameService#initialise
             * @methodOf service.gameService
             *
             * @description
             * Method initialise canvas to use for drawing
             */
            initialise: function(canvasContext) {
                this.canvas = canvasContext;
            },

            /**
             * @ngdoc method
             * @name service.gameService#blankScreen
             * @methodOf service.gameService
             *
             * @description
             * Method will clear screen and redraw
             */
            blankScreen: function() {
                this.canvas.fillStyle = '#428500';
                this.canvas.fillRect(0, 0, 600, 600);
            },

            /**
             * @ngdoc method
             * @name service.gameService#drawText
             * @methodOf service.gameService
             *
             * @description
             * Method will help to draw text on screen
             */
            drawText: function(text, x, y, color) {
                this.canvas.font="30px return";
                this.canvas.fillStyle = color;
                this.canvas.fillText(text, x, y);
            },

            /**
             * @ngdoc method
             * @name service.gameService#drawImage
             * @methodOf service.gameService
             *
             * @description
             * Method will help to draw image on screen
             */
            drawImage: function(image, x, y) {
                this.canvas.drawImage(image, x, y, image.width, image.height);
            },

            /**
             * @ngdoc method
             * @name service.gameService#drawImageWH
             * @methodOf service.gameService
             *
             * @description
             * Method will help to draw image on screen with provided dimensions
             */
            drawImageWH: function(image, x, y, width, height) {
                this.canvas.drawImage(image, x, y, width, height);
            },
        }
    }]);