import {
    registerReceiver,
    invoke,
    Command,
    ACTION_TYPE
  } from 'c/globalStore';
  
describe('c-global-store', () => {
    it('should be able to register and invoke valid receiver', () => {
        let invokedAction = '';
        registerReceiver(command => {
            invokedAction = command.type;
        });
        invoke(new Command(ACTION_TYPE.NavigateForward, 'Test'));
        expect(invokedAction).toBe(ACTION_TYPE.NavigateForward);
    });
});