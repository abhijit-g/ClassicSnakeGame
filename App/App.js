/**
 *
 * @license MIT License Copyright (c) 2017 Abhijit Gurav
 * @author  Abhijit Gurav, https://github.com/abhijit-g/
 *
 */

/**
 *  @ngdoc object
 *  @name module.snake
 */
angular.module("snake", [])

    /**
     *  @ngdoc object
     *  @name controller.appController
     *
     *  @requires $scope
     *  @requires snakeService
     *  @requires gameEngineService
     *
     *  @description
     *  detect keypress event and propagate to services for processing
     */
    .controller("appController", ["$scope", "snakeService", "gameEngineService", function($scope, snakeService, gameEngineService) {
        $scope.keydown = function(keyEvent) {
            snakeService.keyPress(keyEvent.keyCode);

            if(keyEvent.keyCode === 32){
                gameEngineService.keyPress();
            }
        };
    }])

    /**
     *  @ngdoc directive
     *  @name directive.board
     *
     *  @requires $interval
     *  @requires gameService
     *  @requires gameEngineService
     *  @requires snakeService
     *  @requires boardService
     *
     *  @description
     *  This is evrything :)
     */
    .directive("board", ["$interval", "gameService", "gameEngineService", "snakeService", "boardService",
        function($interval, gameService, gameEngineService, snakeService, boardService) {
        return {
            restrict: 'A',
            template:
                '<div class="scoreboard">'+
                    '<div class="stat"><label>Level : </label><label class="stat-label">{{level}}</label></div>'+
                    '<div class="stat"><label>Hidden Eggs : </label><label class="stat-label">{{egg}}</label></div>'+
                    '<div class="stat">'+
                        '<label>Lives : </label>'+
                        '<div ng-repeat="l in lives" class="lives">'+
                            '<img src="App/images/head_1_down.png">'+
                        '</div>'+
                    '</div>'+
                    '<div class="stat"><label>Score : </label><label class="stat-label">{{score}}</label></div>'+
                '</div>'+
                '<canvas id="gameCanvas" width="600" height="600"></canvas>',

            link: function(scope, element) {
                var intervalPromise;
                var animation = 0;
                var context = element.find('canvas')[0].getContext("2d");

                gameService.initialise(context);
                //Game loop which will draw-update-draw till collision logic met or level up
                function gameLoop() {
                    if(!snakeService.isCollided() && !boardService.isPaused()){
                        animation++;

                        if (animation === 4) {
                            animation = 0;
                        }
                        //draw-update-draw---- ;)
                        gameEngineService.update(animation);
                        gameEngineService.draw(animation);
                        //getting stats
                        scope.score = snakeService.getScore();
                        scope.level = boardService.getLevel();
                        scope.lives = snakeService.getLives();
                        scope.egg = snakeService.getEgg();
                    }
                }
                //call gameloop in specific interval till distroy
                intervalPromise = $interval(gameLoop, 1000 / 60);

                scope.$on("$destroy", function() {
                    if (intervalPromise) {
                        $interval.cancel(intervalPromise);
                        intervalPromise = undefined;
                    }
                });
            }
        }
    }]);
