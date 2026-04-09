import { BaseFlippAdapter } from './BaseFlippAdapter'

export class MetroAdapter extends BaseFlippAdapter {
  readonly chain = 'METRO' as const
  readonly merchantNames = ['Metro', 'Metro Plus']
}
