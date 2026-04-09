import { BaseFlippAdapter } from './BaseFlippAdapter'

export class SuperCAdapter extends BaseFlippAdapter {
  readonly chain = 'SUPER_C' as const
  readonly merchantNames = ['Super C']
}
