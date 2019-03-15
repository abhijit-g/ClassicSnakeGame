/**
 *
 * @license MIT License Copyright (c) 2017 Abhijit Gurav
 * @author  Abhijit Gurav, https://github.com/abhijit-g/
 *
 */

/**
 *  @ngdoc object
 *  @name service.boardService
 *
 *  @requires gameService
 *
 *  @description
 *  This service will manage to draw background for game and maze for each level
 */
angular.module("snake")
    .factory("boardService", ["gameService", function(gameService) {
        "use strict";

        /**
         * @ngdoc property
         * @name service.boardService#level
         * @propertyOf service.boardService
         *
         * @description
         * property to store game level
         */
        var level = 1;

        /**
         * @ngdoc property
         * @name service.boardService#brick
         * @propertyOf service.boardService
         *
         * @description
         * property to store brick object
         */
        var brick = new Image();

        /**
         * @ngdoc property
         * @name service.boardService#wall
         * @propertyOf service.boardService
         *
         * @description
         * property to store all bricks object in arraay to help in check collision
         */
        var wall = [];

        /**
         * @ngdoc property
         * @name service.boardService#paused
         * @propertyOf service.boardService
         *
         * @description
         * property to store flag for game state paused or running
         */
         var paused = false;

        brick.src = 'App/images/brick.png';

        return {

            /**
             * @ngdoc method
             * @name service.boardService#raiseLevel
             * @methodOf service.boardService
             *
             * @description
             * Method will increase the level
             */
            raiseLevel: function(){
                level += 1;
                wall = [];
                paused = true;
            },

            /**
             * @ngdoc method
             * @name service.boardService#resetLevel
             * @methodOf service.boardService
             *
             * @description
             * Method will reset level
             */
            resetLevel: function(){
                level = 1;
                wall = [];
            },

            /**
             * @ngdoc method
             * @name service.boardService#cont
             * @methodOf service.boardService
             *
             * @description
             * Method will resume game when paused
             */
            cont: function(){
                paused = false;
            },

            /**
             * @ngdoc method
             * @name service.boardService#getLevel
             * @methodOf service.boardService
             *
             * @description
             * Method will return level
             */
            getLevel: function(){
                return level;
            },

            /**
             * @ngdoc method
             * @name service.boardService#getWall
             * @methodOf service.boardService
             *
             * @description
             * Method will return wall object
             */
            getWall: function(){
                return wall;
            },

            /**
             * @ngdoc method
             * @name service.boardService#isPaused
             * @methodOf service.boardService
             *
             * @description
             * Method will return state of game
             */
            isPaused: function(){
                return paused;
            },

            /**
             * @ngdoc method
             * @name service.boardService#draw
             * @methodOf service.boardService
             *
             * @description
             * Core method of service used for drawing background and maze
             */
            draw: function () {

                //Drawing border with bricks - start
                var x = 0, y = 0;
                while (x < 600) {
                    gameService.drawImage(brick, x, y);
                    wall.push({x: x, y: y});
                    x += 20;
                }

                x -= 20;
                y += 20;

                while (y < 580) {
                    gameService.drawImage(brick, x, y);
                    wall.push({x: x, y: y});
                    y += 20;
                }

                while (x > -20) {
                    gameService.drawImage(brick, x, y);
                    wall.push({x: x, y: y});
                    x -= 20;
                }

                x = 0;

                while (y > 0) {
                    gameService.drawImage(brick, x, y);
                    wall.push({x: x, y: y});
                    y -= 20;
                }
                //Drawing border with bricks - end

                //Drawing level 2 and level 4 maze - vertical line with bricks - start
                if(level === 2 || level === 4){
                    x = 280;
                    y = 140;

                    while (y < 460) {
                        gameService.drawImage(brick, x, y);
                        wall.push({x: x, y: y});
                        y += 20;
                    }

                }
                //Drawing level 2 and level 4 maze - vertical line with bricks - end

                //Drawing level 3 and level 4 maze - horizontal line with bricks - start
                if(level === 3 || level === 4){
                    x = 140;
                    y = 280;

                    while (x < 460) {
                        gameService.drawImage(brick, x, y);
                        wall.push({x: x, y: y});
                        x += 20;
                    }

                }
                //Drawing level 3 and level 4 maze - horizontal line with bricks - end

                //Drawing level 5 maze with bricks - start
                if(level === 5){
                    x = 100,
                    y = 100;
                    while (x < 500) {
                        if(x < 240 || x > 340){
                            gameService.drawImage(brick, x, y);
                            wall.push({x: x, y: y});
                        }
                        x += 20;
                    }

                    x -= 20;
                    y += 20;

                    while (y < 480) {
                        if(y < 240 || y > 340){
                            gameService.drawImage(brick, x, y);
                            wall.push({x: x, y: y});
                        }
                        y += 20;
                    }

                    while (x > 80) {
                        if(x < 240 || x > 340){
                            gameService.drawImage(brick, x, y);
                            wall.push({x: x, y: y});
                        }
                        x -= 20;
                    }

                    x = 100;

                    while (y > 100) {
                        if(y < 240 || y > 340){
                            gameService.drawImage(brick, x, y);
                            wall.push({x: x, y: y});
                        }
                        y -= 20;
                    }
                }
                //Drawing level 5 maze with bricks - end
            }
        }
    }]);