// This file is part of Prusa-Connect-Web
// Copyright (C) 2018-2019 Prusa Research s.r.o. - www.prusa3d.com
// SPDX-License-Identifier: GPL-3.0-or-later

import { h, Component, createRef } from "preact";
import { Text } from 'preact-i18n';
import "./style.scss";
const icon_download = require("../../assets/download.svg")

interface P {
    url: string;
    path: string;
}

interface S {
    active: boolean;
}

class Upload extends Component<P, S> {

    ref = createRef();
    state = { active: false };

    handleDragEnter = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ active: true });
    };

    handleDragLeave = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ active: false });
    };

    handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ active: true });
    };

    handleDrop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        let dt = e.dataTransfer;
        let files = dt.files;
        this.setState({ active: false });
        this.handleFiles(files);
    };

    onclickFile = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const fileInput = this.ref.current;
        if (e.isTrusted && fileInput) {
            fileInput.click();
        }
    }

    handleInput = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        // @ts-ignore
        const files = e.target.files;
        if (files)
            this.handleFiles(files);
    }

    handleFiles = (files) => {
        ([...files]).forEach(this.uploadFile);
    }

    uploadFile = (file: File) => {

        let { url, path } = this.props;
        url = url ? url : "/api/files/local";
        path = path ? path : "";

        let formData = new FormData()
        formData.append('path', path)
        formData.append('file', file)

        fetch(url, {
            method: 'POST',
            body: formData,
            headers: {
                "X-Api-Key": process.env.APIKEY,
            },
        });

    }

    render({ }, { active }) {

        return (
            <div
                class="columns is-multiline is-mobile"
                onDrop={e => this.handleDrop(e)}
                onDragOver={e => this.handleDragOver(e)}
                onDragEnter={e => this.handleDragEnter(e)}
                onDragLeave={e => this.handleDragLeave(e)}
            >
                <div class="column is-full prusa-title-upload">
                    <p class="subtitle is-size-2 is-size-4-desktop has-text-grey is-marginless prusa-line-upload">
                        upload project
                </p>
                </div>
                <div class="column is-10 is-offset-1">
                    <div
                        class={`"columns is-multiline is-mobile prusa-border-dashed ${active ? "prusa-active-upload" : ""}`}
                        onClick={e => this.onclickFile(e)}
                    >
                        <div class="column is-offset-5">
                            <img class="image is-48x48 project-icon-desktop prusa-img-upload" src={icon_download} />
                        </div>
                        <div class="column is-6-touch is-offset-4-touch is-10-desktop is-offset-2-desktop subtitle is-size-5 is-size-6-desktop">
                            Choose a *.sl1 or drop it here.
                        </div>
                    </div>
                </div>
                <input ref={this.ref} style="display:none" type="file" multiple onInput={e => this.handleInput(e)} />
            </div>
        );
    }
}

export default Upload;

