import { BaseFlippAdapter } from './BaseFlippAdapter'

export class ProvigoAdapter extends BaseFlippAdapter {
  readonly chain = 'PROVIGO' as const
  readonly merchantNames = ['Provigo', 'Provigo Le Marché']
}
