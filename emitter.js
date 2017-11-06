'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;


/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    let events = [];

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            if (event !== '' && event !== '.') {
                events.push({ event, context, handler });
            }

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            events = events
                .filter(currentEventObj => {
                    return !containsCurrentEvent(currentEventObj) ||
                        !(currentEventObj.context === context);
                });

            return this;
            function containsCurrentEvent(currentEventObj) {
                return currentEventObj.event.startsWith(event + '.') ||
                    currentEventObj.event === event;
            }
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            const eventParts = event.split('.');

            while (eventParts.length !== 0) {
                const elem = eventParts.join('.');

                events
                    .filter(currentEventObj => currentEventObj.event === elem)
                    .forEach(currentEventObj =>
                        currentEventObj.handler.call(currentEventObj.context));
                eventParts.pop();
            }

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            if (times <= 0) {
                return this.on(event, context, handler);
            }

            this.on(event, context, function () {
                if (times <= 0) {
                    return;
                }
                handler.call(context);
                times--;
            });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            if (frequency <= 0) {
                return this.on(event, context, handler);
            }
            let counter = 0;

            this.on(event, context, function () {
                if (counter % frequency === 0) {
                    handler.call(context);
                }
                counter++;
            });

            return this;
        }
    };
}
