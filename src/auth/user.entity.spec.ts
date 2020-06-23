import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';

describe('User entity', () => {
  let user: User;

  beforeEach(() => {
    user = new User();
    user.password = 'testPassword';
    user.salt = 'testSalt';
    bcrypt.hash = jest.fn();
  });

  describe('validatePassword', () => {
    it('returns true as password is valid', async () => {
      bcrypt.hash.mockReturnValue('testPassword');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await user.validatePassword('12345');
      expect(bcrypt.hash).toHaveBeenCalledWith('12345', user.salt);
      expect(result).toEqual(true);
    });
    it('returns false as password is invalid', async () => {
      bcrypt.hash.mockReturnValue('wrongPassword');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await user.validatePassword('12345');
      expect(bcrypt.hash).toHaveBeenCalledWith('12345', user.salt);
      expect(result).toEqual(false);
    });
  });
});
