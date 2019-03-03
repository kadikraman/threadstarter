const { getEventType } = require('./events');
const { eventTypes } = require('./consts');

describe('events', () => {
  describe('getEventType', () => {
    it('detects root level message correctly', () => {
      const body = {
        token: 'nothing-to-see-here',
        team_id: 'T02913TEC',
        api_app_id: 'AGNHF279D',
        event: {
          client_msg_id: '02df7791-3ed8-43b3-9a7c-6b3f83e35c4f',
          type: 'message',
          text: 'Spam',
          user: 'U7TAFNSGJ',
          ts: '1551629282.002400',
          channel: 'C0E67FMMJ',
          event_ts: '1551629282.002400',
          channel_type: 'channel',
        },
        type: 'event_callback',
        event_id: 'EvGMNMR42Y',
        event_time: 1551629282,
        authed_users: ['UGMF2HYAY'],
      };

      expect(getEventType(body)).toBe(eventTypes.TOP_LEVEL_MESSAGE);
    });

    it('detects its own threaded reply correctly', () => {
      const body = {
        token: 'nothing-to-see-here',
        team_id: 'T02913TEC',
        api_app_id: 'AGNHF279D',
        event: {
          type: 'message',
          subtype: 'bot_message',
          text: ':thread: Remember to use threads!',
          ts: '1551629283.002500',
          username: 'Threadstarter',
          bot_id: 'BGLUV25BK',
          thread_ts: '1551629282.002400',
          parent_user_id: 'U7TAFNSGJ',
          channel: 'C0E67FMMJ',
          event_ts: '1551629283.002500',
          channel_type: 'channel',
        },
        type: 'event_callback',
        event_id: 'EvGN42N79T',
        event_time: 1551629283,
        authed_users: ['UGMF2HYAY'],
      };
      expect(getEventType(body)).toBe(eventTypes.BOT_MESSAGE);
    });

    it('detects a reply correctly', () => {
      const body = {
        token: 'nothing-to-see-here',
        team_id: 'T02913TEC',
        api_app_id: 'AGNHF279D',
        event: {
          client_msg_id: '90df9e2c-84e3-4394-8f45-00e02d1b99c0',
          type: 'message',
          text: 'more spam',
          user: 'U7TAFNSGJ',
          ts: '1551629987.002700',
          thread_ts: '1551629282.002400',
          parent_user_id: 'U7TAFNSGJ',
          channel: 'C0E67FMMJ',
          event_ts: '1551629987.002700',
          channel_type: 'channel',
        },
        type: 'event_callback',
        event_id: 'EvGNS1FYJ3',
        event_time: 1551629987,
        authed_users: ['UGMF2HYAY'],
      };
      expect(getEventType(body)).toBe(eventTypes.THREADED_REPLY);
    });
  });
});
