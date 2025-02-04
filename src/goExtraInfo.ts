/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------*/

'use strict';

import { HoverProvider, Hover, TextDocument, Position, CancellationToken } from 'vscode';
import { definitionLocation } from './goDeclaration';

export class GoHoverProvider implements HoverProvider {
	public provideHover(document: TextDocument, position: Position, token: CancellationToken): Thenable<Hover> {
		return definitionLocation(document, position, false).then(definitionInfo => {
			if (definitionInfo == null) return;
			let lines = definitionInfo.lines;
			lines = lines.map(line => {
				if (line.indexOf('\t') === 0) {
					line = line.slice(1);
				}
				return line.replace(/\t/g, '  ');
			});
			lines = lines.filter(line => line.length !== 0);
			if (lines.length > 10) lines[9] = '...';
			let text;
			if (lines.length > 1) {
				text = lines.slice(1, 10).join('\n');
				text = text.replace(/\n+$/, '');
			} else {
				text = lines[0];
			}
			let hover = new Hover({ language: 'go', value: text });
			return hover;
		});
	}
}
