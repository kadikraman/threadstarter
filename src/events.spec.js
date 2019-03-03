const { getEventType, getBotMessage } = require('./events');
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

  describe('#getBotMessageId', () => {
    it('gets the id of the bot message in the thread if it exists', () => {
      const history = {
        messages: [
          {
            client_msg_id: '8ce4770c-5447-45f8-ba9b-b3f5b0f316fc',
            type: 'message',
            text: 'Are you still there?',
            user: 'U7TAFNSGJ',
            ts: '1551630651.003000',
            thread_ts: '1551630651.003000',
            reply_count: 3,
            reply_users_count: 2,
            latest_reply: '1551638358.004100',
            reply_users: ['BGLUV25BK', 'U7TAFNSGJ'],
            replies: [
              {
                user: 'BGLUV25BK',
                ts: '1551630652.003100',
              },
              {
                user: 'U7TAFNSGJ',
                ts: '1551638326.003900',
              },
              {
                user: 'U7TAFNSGJ',
                ts: '1551638358.004100',
              },
            ],
            subscribed: true,
            last_read: '1551638358.004100',
          },
          {
            type: 'message',
            subtype: 'bot_message',
            text: 'Remember to use threads! :thread:',
            ts: '1551630652.003100',
            username: 'Threadstarter',
            bot_id: 'BGLUV25BK',
            thread_ts: '1551630651.003000',
            parent_user_id: 'U7TAFNSGJ',
          },
        ],
        has_more: true,
        ok: true,
        response_metadata: {
          next_cursor: 'bmV4dF90czoxNTUxNjM4MzI2MDAzOTAw',
        },
      };

      expect(getBotMessage(history)).toEqual({
        type: 'message',
        subtype: 'bot_message',
        text: 'Remember to use threads! :thread:',
        ts: '1551630652.003100',
        username: 'Threadstarter',
        bot_id: 'BGLUV25BK',
        thread_ts: '1551630651.003000',
        parent_user_id: 'U7TAFNSGJ',
      });
    });

    it('returns null when there is no bot message', () => {
      const history = {
        messages: [
          {},
          {
            type: 'message',
            text: 'Just a random message',
            ts: '1551630652.003100',
            username: 'Threadstarter',
            bot_id: 'BGLUV25BK',
            thread_ts: '1551630651.003000',
            parent_user_id: 'U7TAFNSGJ',
          },
        ],
      };

      expect(getBotMessage(history)).toBe(null);
    });
  });
});
